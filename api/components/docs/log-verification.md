## Log submission Scenarios

#### Instructions
- Create a fork of the [verification-logs](https://github.com/ONDC-Official/verification-logs) repository.
- Create a folder with the name of your entity under your domain folder "TRV11"
- Commit your logs in the folder (logs should include request & response payloads for all enabled APIs as per the scenarios below)
- Create PR and label it with your domain name
- Once submitted, please refer to the comments on logs submitted and update the PR based on the comments provided
- Once the reviews are done, the PR will be merged and the logs shall be considered as approved on pr merge

### File Naming conventions:
1. **Single Endpoint Naming**:

   - For a single API endpoint, the file name should precisely match the name of the endpoint. For example:
     - `select: select.json` (for the "select" endpoint)
     - `on_select: on_select.json` (for the "on_select" endpoint)

2. **Multiple Calls for Same Endpoint**:

   - When there are multiple API calls for the same endpoint, the naming convention should reflect the sequence of calls using numeric suffixes:
     - `search 1: search_1.json` (for the first call of the "search" endpoint)
     - `search 2: search_2.json` (for the second call of the "search" endpoint)

These naming conventions ensure clear identification and organization of files based on the corresponding API endpoints and their respective calls.

## Scenarios

1. Flow 1

- Passenger searches for services available between a start location and an end location. Providers provide their services details
- Passenger selects a provider and a ticket type. Provider responds with detailed information and quote for the specific service requested
- Passenger proceeds with the details provided and the consumer platform sends the request with respective billing details. Provider platform responds with the updated quote and settlement details
- Payment is collected and a confirmation call is made. The provider provides confirmation of the order with the ticket
- Journey is completed and status update is made on the order object

2. Flow 2

- Passenger searches for services available between a start location and an end location. Providers provide their services details
- Passenger selects a provider and a ticket type. Provider responds with detailed information and quote for the specific service requested
- Passenger proceeds with the details provided and the consumer platform sends the request with respective billing details. Provider platform responds with the updated quote and settlement details
- Payment is collected and a confirmation call is made. The provider provides confirmation of the order with the ticket
- Passenger proceeds to cancel the ticket. Provider provides with the requisite response

### Log Verification
To verify your logs, you can use the POST method exposed at [https://log-validation.ondc.org/api/validate/trv](https://log-validation.ondc.org/api/validate/trv) within the [Log Validation Utility](https://github.com/ONDC-Official/log-validation-utility).

Available flows are:

##### Metro
- METRO_STATION_CODE
- METRO_GPS
- METRO_USER_CANCEL
- METRO_TECHNICAL_CANCEL
##### Intracity
- INTRACITY_STATION_CODE
- INTRACITY_GPS
- INTRACITY_USER_CANCEL
- INTRACITY_TECHNICAL_CANCEL

The payload structure for validation is as follows:

```json
{
  "domain": "ONDC:TRV11",
  "version": "2.0.1",
  "flow": "STATION_CODE",
  "payload": {
    "search_1": {},
    "on_search_1": {},
    "search_2": {},
    "on_search_2": {},
    "select": {},
    "on_select": {},
    "init": {},
    "on_init": {},
    "confirm": {},
    "on_confirm": {},
    "status": {},
    "on_status": {}
  }
}
```

The api call sequence inside the payload object might differ based on different flows

_Note: Log verification will follow a FIFO model with a TAT of 4 days_