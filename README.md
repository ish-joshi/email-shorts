# Hello

I am building a simple CDK app to build an infrastructure that summarises emails and creates an API to access the summaries.


## Running locally
### Pre-requisites
* Localstack
  * `cdklocal`
  * `awslocal`
* Docker
* CDK Setup (npm install -g aws-cdk)
  

### Steps
1. Clone the repository
2. npm install
3. Start localstack `localstack start`
4. Run `cdklocal bootstrap`
5. Run `cdklocal deploy`


