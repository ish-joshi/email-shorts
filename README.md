# Hello

I am building a simple CDK app to build an infrastructure that summarises emails and creates an API to access the summaries.


https://github.com/ish-joshi/email-shorts/assets/25214445/d7938d97-ba25-4d64-8fdf-e1b16f4ac96e





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


