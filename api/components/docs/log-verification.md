## Log submission Scenarios for Metro

#### Instructions
- Create a fork of the [verification-logs](https://github.com/ONDC-Official/verification-logs) repository. 
- Create a folder with the name of your entity under your domain folder "TRV11" for metro
- Commit your logs in the folder (logs should include request & response payloads for all enabled APIs as per the scenarios below)
- Create PR and label it with your domain name
- Once submitted, please refer to the comments on logs submitted and update the PR based on the comments provided
- Once the reviews are done, the PR will be merged and the logs shall be considered as approved on pr merge


## Scenarios
1. Flow 1
  - Passenger searches for metro services available between a start location and an end location. Providers provide their services details
  - Passenger selects a metro provider and a ticket type. Provider responds with detailed information and quote for the specific service requested
  - Passenger proceeds with the details provided and the consumer platform sends the request with respective billing details. Provider platform responds with the updated quote and settlement details
  - Payment is collected and a confirmation call is made. The provider provides confirmation of the order with the ticket
  - Journey is completed and status update is made on the order object

2. Flow 2
  - Passenger searches for metro services available between a start location and an end location. Providers provide their services details
  - Passenger selects a metro provider and a ticket type. Provider responds with detailed information and quote for the specific service requested
  - Passenger proceeds with the details provided and the consumer platform sends the request with respective billing details. Provider platform responds with the updated quote and settlement details
  - Payment is collected and a confirmation call is made. The provider provides confirmation of the order with the ticket
  - Passenger proceeds to cancel the ticket. Metro provider provides with the requisite response 

<!-- ### Scenarios -->
*Note: Log verification will follow a FIFO model with a TAT of 4 days*
