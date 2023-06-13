# mobility-specification
## On-Demand Ride Hailing Service From Fix Start and End Location
/search	<br>
User wants to go from location A to B now	<br>
/on_search<br>
On demand cab service response to user going from location A to location B now	<br>
/select	<br>
User chooses to travel by SUV	<br>
/on_select	<br>
Seller app responds with quote	<br>
/init	<br>
Buyer App accepts the quote with customer details	<br>
/on_init	<br>
Sends order with payment details	<br>
/confirm	<br>
Buyer app confirms the payment	<br>
/on_confirm	<br>
Seller App confirms the order	<br>
/status	<br>
Buyer app checks the status of the order	<br>
/on_status <br>	
Seller App returns with details of the cab	<br>
/track	<br>
Buyer app requests the seller app for tracking URL	<br>
/on_track	<br>
Seller app responds with the tracking URL	<br>
/rating	<br>
Buyer app rates the driver<br>	
/on_rating	<br>
Seller App acknowledges the rating	<br>
/cancel	<br>
Buyer app wants to cancel the order	<br>
/on_cancel	<br>
Seller App acknowledges the cancellation of order	<br>
/on_update (WIP)	<br>
Seller app updates order with driver assigned for ride	<br>
Seller app updates ride is started	<br>
