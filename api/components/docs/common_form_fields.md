# Common Forms Fields

| Form Field Name | Form Headings      | Use-case Name                      | Form Field Type | Required | Regex                                             | ENUM                      | FORMAT |
| --------------- | ------------------ | ---------------------------------- | --------------- | -------- | ------------------------------------------------- | ------------------------- | ------ |
| name            | ADDITIONAL_DETAILS | Purhcase Journey(Culture Heritage) | string          | false    | ^[A-Za-z]+(?:\\s[A-Za-z]+)*$                      | -                         |        |
| country         | ADDITIONAL_DETAILS | Purhcase Journey(Culture Heritage) | string          | false    | ^[A-Za-z]+(?:[ ]+[A-Za-z]+)*$                     | -                         |        |
| countryCode     | ADDITIONAL_DETAILS | Purhcase Journey(Culture Heritage) | string          | false    | ^[A-Z]{3}$                                        | -                         |        |
| age             | ADDITIONAL_DETAILS | Purhcase Journey(Culture Heritage) | string          | false    | ^(?:120\|1[01]\d\|[1-9]?\d)$                      | -                         |        |
| email           | ADDITIONAL_DETAILS | Purhcase Journey(Culture Heritage) | string          | false    | ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$ | -                         |        |
| gender          | ADDITIONAL_DETAILS | Purhcase Journey(Culture Heritage) | enum            | false    |                                                   | Male\|Female\|Transgender |        |
| phoneNumber     | ADDITIONAL_DETAILS | Purhcase Journey(Culture Heritage) | string          | false    | `^(?:\+91\|91)?[6-9]\d{9}$`                      |                           |        |
| idProof         | ADDITIONAL_DETAILS | Purhcase Journey(Culture Heritage) | enum            | false    |                                                   | Passport                  |        |
| passportNumber  | ADDITIONAL_DETAILS | Purhcase Journey(Culture Heritage) | string          | false    | ^[A-Za-z0-9]{6,20}$*$                           |                           |        |
