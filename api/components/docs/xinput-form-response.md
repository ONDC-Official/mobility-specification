# XInput

This XInput schema facilitates seamless communication between buyers and sellers by allowing the exchange of additional information through forms.
Sellers can request specific details using custom forms, and buyers respond with the necessary information, ensuring a smooth transaction process.
The differentiation in MIME types and additional settings, such as resubmit and multiple submissions, adds flexibility to the form interaction between participants.

## Seller-Side Form:

```
{
  "xinput": {
    "head": {
      "descriptor": {
        "name": "Form Details"
      },
      "index": {
        "min": 0,
        "cur": 0,
        "max": 0
      },
      "headings": ["Form Details"]
    },
    "form": {
      "id": "<Form_ID>",
      "mime_type": "<MIME_Type>",
      "url": "<Form_URL>",
      "multiple_submissions": <multiple_submissions_Flag>
    },
    "required": true
  }
}
```

- `head`: Contains basic details regarding the form such as form name, index.

  - `name`: Describes the form name.
  - `index`: Specifies the minimum, current, and maximum indexes.
    - `min`: Minimum index value.
    - `cur`: Current index value.
    - `max`: Maximum index value.
  - `headings`: Array containing all the form headings.
- `form`: Represents the form itself.

  - `id`: Unique ID associated with the form.
  - `mime_type`: Type of MIME.
  - `url`: Endpoint where the form is hosted.
  - `multiple_submissions`: Indicates whether multiple submissions are allowed.

  ### Additional Behavior:

  When the `cur` and `max` index values are the same, there will be an additional consecutive `action` and `on_action` call. The `action` call will include the `submission_id`, and the `on_action` call will provide the confirmation response.

### mime_type:

 Describes the type of MIME.It can be one of the thee possible values: application/html or text/html or text/html-multi.

- **text/html**:
  - If the mime_type field is set to text/html, it indicates that the Seller App expects the Buyer App to retrieve and render an HTML document. To handle this scenario, the Buyer App should perform the following steps:
  - Initiate a Fetch Request:
    The Buyer App must send an HTTP fetch request to the URL provided by the Seller App. This URL is included in the xinput object as part of on_action calls.
  - Process the Response:
    When the Seller App receives this request, it will respond with the complete HTML document.
  - Render the HTML Document:
    Once the complete HTML document is retrieved, the Buyer App must render it on the user interface as intended. This could involve displaying it within a web view or a similar component in the app, ensuring that the user has a seamless and interactive experience.
    [![Image](https://github.com/ONDC-Official/ONDC-FIS-Specifications/raw/branchName/api/components/docs/images/xinput.png)](https://github.com/ONDC-Official/ONDC-FIS-Specifications/raw/branchName/api/components/docs/images/xinput.png)

The rendered HTML-based form structure looks like this:

````html
<form action="/form/submission-path">
  <label for="dob">Date of Birth</label>
  <input type="date" id="dob" name="dob" />
  <label for="panValue">PAN Number</label>
  <input type="text" id="panValue" name="panValue" />
  <input type="hidden" id="formId" name="formId" value="<Form_ID>" />
  <input type="submit" value="Submit" />
</form>
````

The form gets submitted at the specified path in action. On submission, if successful, the buyer is provided with a submission_id.

```shell
{
  "submission_id": "f5a9f4fe-fc3a-4432-aa2d-d397724a5061"
}
```

If an error occurs while submitting the form, then with an appropriate error code, a message will be sent as part of response.

```shell
{
  "message": {
    "ack": {
      "status": "NACK"
    }
  },
  "error": {
    "code": "07",
    "message": "Data sent in request is not correct"
  }
}
```

Note: While submitting text/html form, API headers will contain [Content-Type:"multipart/form-data"].

- **application/html**:

On the other hand, if the mime_type is set to application/html, the seller provides a link to an external HTML page where the buyer can submit the required information.

- **text/html-multi**:
  If the form type is text/html-multi, the buyer app can include multiple form fields similar to the original form, allowing for the addition of extra details.

````html
<form action="/form/submission-path" method="POST" >
  <label for="dob">Date of Birth</label>
  <input type="date" id="dob" name="dob" />
  <label for="panValue">PAN Number</label>
  <input type="text" id="panValue" name="panValue" />
  <input type="hidden" id="formId" name="formId" value="<Form_ID>" />
  <input type="submit" value="Submit" />
</form>

Buyer app needs to follow the below construct while submitting the form by capturing the multiple instances of the same form.
```
  {
      "dob": ["17/11/2021", "19/12/2003"],
      "panValue": ["RKPUS3413T", "SKPUS3413L"]
  }
  
```

   

## Form response

There are 2 possible ways to get the latest status after submitting a form

1. #### Form response for text/html
   On successfull submission the buyer is provided with a submission_id, which the buyer can use to send as part of next call.

```shell
{
  "xinput": {
    "form_response": {
      "status": "<Status>",
      "submission_id": "<Submission_ID>"
    }
  }
}
```


- `form_response`: Represents the form info after submitting a form.

  - `status`: Denotes the latest state of the form after submission. Possible values include SUCCESS, PENDING, REJECTED, APPROVED.
  - `submission_id`: Contains the unique ID that the buyer receives upon successful form submission.

2. #### Form response for application/html
   To provide the buyer with latest form status, seller sends an unsolicated on_status call with Submission_ID. Additionally, if the seller doesn't sends an unsolicated call, the buyer can request the latest form status by sending a status call with the ref_id.

```shell
{
  "xinput": {
    "form_response": {
      "status": "<updated_status>",
      "submission_id": "<Submission_ID>"
    }
  }
}
```

- The seller responds with the latest status of submitted form corresponding to the submission_id ("Submission_ID") that was submitted earlier by the buyer.
````

### Possible List of Fields
##### Below is a possible consolidated list of fields with their data types and illustrative values

Field Name                    | Field Description            | Data Type            | Illustrative Value            |
------------------------------|------------------------------|----------------------|-------------------------------|
pickupLocation                | Pickup Location              | Text Field           | Delhi T2 Airport              |
pickupDateTime                | Pickup Date & Time           | Date & Time Picker      | 13-Feb-2026, 8:30 pm          |
specialRequirements          | Special Requirements         | Text Field           | Arrange for a wheel chair     |
arrivalAirlineName          | Arrival Airline Name         | Text Field           | Indigo                        |
arrivalFlightNumber         | Arrival Flight Number        | Text Field           | 6E 123                           |
arrivalDateTime           | Arrival Date & Time          | Date & Time Picker       | 13-Feb-2026, 8:30 pm          |
arrivalPickupLocation      | Arrival Pickup Location      | Text Field           | Delhi T2 Airport              |
arrivalModeOfTransfer      | Arrival Mode of Transfer     | Text Field           | SUV                           |
dropLocation                 | Drop Location                | Text Field           | Delhi T2 Airport              |
departureAirlineName        | Departure Airline Name       | Text Field           | Indigo                        |
departureFlightNumber       | Departure Flight Number      | Text Field           | 6E 123                        |
departureDateTime         | Departure Date & Time        | Date & Time Picker       | 13-Feb-2026, 8:30 pm          |
departurePickupLocation     | Departure Pickup Location    | Text Field           | Siri Fort, Delhi              |
departureModeOfTransfer    | Departure Mode of Transfer   | Text Field           | Sedan AC                     |
age                           | Age                          | Text Field           | 40                            |
firstName                    | First Name                   | Text Field           | John                          |
lastName                     | Last Name                    | Text Field           | Smith                         |
passportGivenName          | Passport Given Name          | Text Field           | John Smith                   |
passportSurnameName         | Passport Surname Name        | Text Field           | Gerald                        |
passportExpiry               | Passport Expiry              | Date Picker          | 13-Feb-2026                  |
passportNationality          | Passport Nationality         | Text Field           | Indian                        |
passportNumber               | Passport Number              | Text Field           | F123456                      |
height                        | Height                       | Text Field           | 5 Ft 3 inch                  |
weight                        | Weight                       | Text Field           | 80 Kg                        |
dateOfBirth                 | Date of Birth                | Date Picker          | 13-Feb-2020                  |