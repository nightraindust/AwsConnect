const axios = require('axios');
const qs = require('qs');
const config = require('config');

const clientId = config.get('awsClientId');
const clientSecret = config.get('awsClientSecret');
const awsAuthURI = config.get('awsAuthURI');
const awsAdEndpoint = config.get('awsAdEndpoint');
const accessTokenURI = config.get('accessTokenURI');

const {
  HttpClient,
  OperationProvider,
  SponsoredProductsReportOperation,
  OAuthClient
} = require('@scaleleap/amazon-advertising-api-sdk');

const Report = require('../models/Report');

const { yyyymmdd } = require('./miniFunctions');

const demoRefToken =
  'Atzr|IwEBIDbSSD9TjdPLTDIdp95bXW3t3AGp6hRf4IZM9dy90Krxrer4qNssKo8WsVaQqME6qyoP2iZ6ocSnVavA_479Dchks4qtN-4N11UFQLKmaPQF4PqhIn_GKxmOR9bTvU0fzLeswLk7LuhvosldXmmcHMZAWgQvjWQWLUeWEsfOU1YQMAXuhH93XCiBq0IF82Ymo9b3COTOq91aXvwW7qDjbm4RiVVo9iFiyjNIjdTS8zMW2jVGO9yEK4lYppySAM9n0JuC0ekGBtnm56nzCVYIlmPYmLlTt3RvSi9J8MGVaesizrcp1L6ZrsjdPBHAPinzxUnG1xKrn0NMw7yUMiCC4buQDvmSJjizoIggS4mA0a3UFU1gKWV43iErtqgpN1VoqeeTLJjGOAWKkc2pbvBpiqjhMRuwUB5tUeFc_nlp47SvkuR0Lq-RMLGUhU7kBNfGuzeQrzShrQFibcRmgwSOeXsa5yUzBfiyKidTqPKdeFck0Q';

module.exports = () => {
  return new Promise(async (resolve) => {
    console.log('Starting Retrive Report...');

    var data = qs.stringify({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: demoRefToken,
      client_secret: clientSecret
    });
    var config = {
      method: 'post',
      url: awsAuthURI,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: data
    };

    const firstToken = await axios(config);

    console.log('Token refreshed >>>');
    console.log(firstToken.data.access_token);
    console.log('Now generating a new report on AWS side...');

    const client = new OAuthClient(
      {
        clientId: clientId,
        clientSecret: clientSecret,
        redirectUri: 'https://amzppcguru.herokuapp.com/'
      },
      {
        advertising: {
          region: {
            accessTokenUri: accessTokenURI,
            authorizationUri: awsAuthURI,
            endpoint: awsAdEndpoint
          }
        }
      }
    );

    const token = client.createToken(
      firstToken.data.access_token,
      demoRefToken
    );

    const httpClient = new HttpClient(
      awsAdEndpoint,
      {
        accessToken: token.accessToken,
        clientId: clientId,
        scope: '3329766743801904'
      },
      true
    );

    const operationProvider = new OperationProvider(httpClient);

    const reportOperation = operationProvider.create(
      SponsoredProductsReportOperation
    );

    const reportData = await reportOperation.requestReport({
      metrics: [
        'campaignName',
        'impressions',
        'clicks',
        'asin',
        'sku',
        'cost',
        'attributedSales1d',
        'attributedSales7d',
        'attributedSales14d',
        'attributedSales30d',
        'attributedUnitsOrdered1d',
        'attributedUnitsOrdered7d',
        'attributedUnitsOrdered14d',
        'attributedUnitsOrdered30d'
      ],
      recordType: 'productAds',
      reportDate: yyyymmdd()
    });

    console.log('Report generation process started');
    console.log('Report ID is >>> ', reportData.reportId);

    var reportCheckInterval = setInterval(async () => {
      const reportStatus = await reportOperation.getReport(reportData.reportId);
      console.log('REPORT GENERATION ', reportStatus.status);
      if (reportStatus.status == 'SUCCESS') {
        console.log(
          'Report has been successfully generated. Now downloading...'
        );
        downloadData();
        clearInterval(reportCheckInterval);
      }
    }, 5000);

    const downloadData = async () => {
      const reportFile = await reportOperation.downloadReport(
        reportData.reportId
      );

      console.log('Report downloaded, now writing into database...');

      const saveReport = await Report.insertMany(reportFile);
      console.log(
        'Database query done! Total',
        saveReport.length,
        'documents were retrived.'
      );
      resolve(saveReport.length);
    };
  });
};
