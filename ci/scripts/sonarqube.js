const scanner = require('sonarqube-scanner');
const pkg = require('../../package.json');
const https = require('https');

const branch = 'master';

const projectKey = 'log-driven-dev';

const checkSonarqube = () => {
  https.get(`${process.env.SONAR_HOST_URL}/api/qualitygates/project_status?projectKey=${projectKey}&branch=${branch}`, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(process.env.SONARQUBE_TOKEN + ':', 'utf-8').toString('base64')
    }
  }, (res) => {
    if (res.statusCode !== 200) {
      console.error('Failed to check Sonarqube quality gate:', res.statusCode);
      process.exit(2);
    }

    res.on('data', (d) => {
      const { status, conditions } = JSON.parse(d.toString()).projectStatus;
      const comparators = { GT: '>', LT: '<', NE: '!=' };
      if (status === 'OK') {
        console.info('Sonarqube quality gate passed');
      } else {
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n Sonarqube quality gate failed:')
        for (const { status: conStatus, metricKey, actualValue, comparator, errorThreshold } of conditions) {
          if (conStatus !== 'OK') {
            console.error(` ${metricKey} = ${actualValue}\t threshold is ${comparators[comparator]} ${errorThreshold}`);
          }
        }
        process.exit(1);
      }
    });
  }).on('error', (e) => {
    console.error('failed to check Sonarqube quality gate:' + e);
    process.exit(3);
  })
}

scanner(
  {
    serverUrl : process.env.SONAR_HOST_URL,
    options: {
      'sonar.login': process.env.SONARQUBE_TOKEN,
      'sonar.projectKey': projectKey,
      'sonar.projectName': 'log-driven-dev',
      'sonar.projectVersion': pkg.version,
      'sonar.projectDescription': pkg.description,
      // 'sonar.branch.name': branch,
      'sonar.links.homepage': pkg.homepage,
      'sonar.links.issue': pkg.bugs.url,
      'sonar.links.scm': pkg.repository.url,
      'sonar.sources': 'src',
      'sonar.source.exclusions': 'src/**.spec.ts,src/test/**.ts',
      'sonar.test.inclusions': 'src/**.spec.ts',
      'sonar.tests': 'src',
      'sonar.testExecutionReportPaths': 'test-report.xml',
    }
  },
  checkSonarqube
)
