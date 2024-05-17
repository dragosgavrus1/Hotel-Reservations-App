# Hotel-Reservations-App 
A fullstack hotel reservations app made with java spring backend and react frontend.

Login page:
Allows users to log in by providing their username and password. Includes input validation to ensure both fields are filled before enabling the login button. Upon successful login, users are redirected to the hotel list page ("/hotels"). Offers navigation to the registration page for new users.

![login](https://github.com/dragosgavrus1/Hotel-Reservations-App/assets/115423453/23bc18ae-c6de-4f5f-9ba1-96625a2c5b41)

Register page:
Allows new users to register by providing a username and password. Upon successful registration, users are redirected to the login page ("/"). Provides input validation to ensure both fields are filled before enabling the register button. Displays an error message if registration fails.

![register](https://github.com/dragosgavrus1/Hotel-Reservations-App/assets/115423453/aa1daaf2-9dd7-4aba-bb5d-4bc09aa385ee)

Hotel list:
Displays a list of hotels, allowing users to search for nearby hotels based on their current location. Users can input a search range in kilometers and click the search button to find hotels within the specified radius. Each hotel is displayed as a clickable link, directing users to the hotel details page ("/hotels/:id"). Additionally, there's a button to navigate to the user's reservations page ("/reservations").

![hotel-list](https://github.com/dragosgavrus1/Hotel-Reservations-App/assets/115423453/3960a385-1e1c-4d9f-958a-5e0718172df6)

Hotel details:
Displays detailed information about a specific hotel, including room selection, reservation date and time, feedback section, and navigation buttons. Users can select rooms to reserve, choose a reservation date and time, view hotel reviews, and leave feedback. Reservation functionality allows users to book rooms or change existing reservations, navigating to the reservations page after successful booking.

![hotel-detail](https://github.com/dragosgavrus1/Hotel-Reservations-App/assets/115423453/bb566c85-6e4e-4603-943e-2e4e221d877f)

Reservation list:
Displays a list of reservations made by the user, including reservation ID, hotel name, room numbers, and reservation date and time. Users can cancel reservations or change rooms for existing reservations. The reservation date and time are formatted for better readability. Additionally, users can navigate back to the hotels list page.

![reservation](https://github.com/dragosgavrus1/Hotel-Reservations-App/assets/115423453/ec0621eb-cd4c-4f1a-9ce6-81f0e2d382d0)

Feedback form:
Allows users to leave feedback for a specific hotel by providing a description and rating. Users must be logged in to submit feedback. Upon submission, the feedback is sent to the backend, and a success or failure message is displayed accordingly. Users can navigate back to the hotel details page after submitting feedback.

![feedback](https://github.com/dragosgavrus1/Hotel-Reservations-App/assets/115423453/67418e32-2136-467f-90b9-d0f105c1fc6e)

