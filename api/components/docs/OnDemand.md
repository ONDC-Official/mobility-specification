## Log submission Scenarios for On-Demand Ride Hailing

#### Instructions
- Create a fork of the [verification-logs](https://github.com/ONDC-Official/verification-logs) repository. 
- Create a folder with the name of your entity under your domain folder "TRV10" for ride hailing
- Commit your logs in the folder (logs should include request & response payloads for all enabled APIs as per the scenarios below)
- Create PR and label it with your domain name
- Once submitted, please refer to the comments on logs submitted and update the PR based on the comments provided
- Once the reviews are done, the PR will be merged and the logs shall be considered as approved on pr merge


### Scenarios
- Flow 1 - successful ride
    1. Passenger searches for on demand services available between a start location and an end location. Providers provide their services details
    2. Passenger selects a provider and a service. Provider responds with detailed information and quote for the specific service
    3. Passenger proceeds with the details provided and the consumer platform sends the request with respective billing details. Provider platform responds with the updated quote and settlement details
    4. Payment is collected and a confirmation call is made with an order id. The provider provides confirmation of the ride and the driver assigned
    5. The ride is completed and status update is made on the order object

- Flow 2 - passenger initiated cancellation
    1. Passenger searches for on demand services available between a start location and an end location. Providers provide their services details
    2. Passenger selects a provider and a service. Provider responds with detailed information and quote for the specific service
    3. Passenger proceeds with the details provided and the consumer platform sends the request with respective billing details. Provider platform responds with the updated quote and settlement details
    4. Payment is collected and a confirmation call is made with an order id. The provider provides confirmation of the ride and the driver assigned
    5. After the driver is assigned and is on the way to the location, the passenger initiates a cancel request and the consumer platform creates the cancel request. The provider platform accepts the cancellation and updates the quote price with the applicable cancellation fee 

- Flow 3 - driver initiated cancellation
    1. Passenger searches for on demand services available between a start location and an end location. Providers provide their services details
    2. Passenger selects a provider and a service. Provider responds with detailed information and quote for the specific service
    3. Passenger proceeds with the details provided and the consumer platform sends the request with respective billing details. Provider platform responds with the updated quote and settlement details
    4. Payment is collected and a confirmation call is made with an order id. The provider provides confirmation of the ride and the driver assigned
    5. After the service is initiated, the driver initiates a cancellation request and the provider platform notifies the consumer platform of the cancellation

- Flow 4 - quote change after ride
    1. Passenger searches for on demand services available between a start location and an end location. Providers provide their services details
    2. Passenger selects a provider and a service. Provider responds with detailed information and quote for the specific service
    3. Passenger proceeds with the details provided and the consumer platform sends the request with respective billing details. Provider platform responds with the updated quote and settlement details
    4. Payment is collected and a confirmation call is made with an order id. The provider provides confirmation of the ride and the driver assigned
    5. The service is completed with an update required on the price. The seller app sends the on_update payload with the updated quote object

Logs should be extracted for each of the flows above in this sequence: /search & /on_search, /select & /on_select, /init & /on_init, /confirm & /on_confirm, /status & /on_status (after confirm), /update & /on_update, /status & /on_status;

*Note: Log verification will follow a FIFO model with a TAT of 4 days*
