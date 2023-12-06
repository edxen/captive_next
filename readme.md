# Project: Captive Portal with Guest Login and Access Code

##### Availble at: https://captive-next.vercel.app/

## Overview
I developed a multi-page captive portal using TypeScript and Next.js, focusing on seamless navigation and context hooks for efficient data persistence across the application. The project aimed to provide guests with a streamlined login experience via guest login (room number and last name) or access codes, all while managing data storage in Firebase.

## Technologies Utilized
- **TypeScript:** Leveraged for strong typing and enhanced code integrity.
- **Next.js:** Employed for server-side rendering and page routing, ensuring smooth navigation.
- **Firebase:** Utilized as the primary database for storing and retrieving data.
- **Styled Components:** Implemented for a clean and modular CSS-in-JS styling approach, ensuring a responsive and visually appealing user interface.

## Key Features and Contributions
- **Multi-page Layout:** Designed and implemented a cohesive layout across multiple pages for an intuitive user experience.
- **Context Hooks for Data Persistence:** Utilized context hooks effectively to maintain state across various components, enhancing performance and user interaction.
- **Guest Login with Access Codes:** Created a streamlined login system allowing guests to access the portal using guest login (room number or last name) or unique access codes.
- **API Integration:** Incorporated API calls to Firebase for efficient data retrieval and storage.

## Learning Outcomes
This project enabled me to deepen my understanding of TypeScript, Next.js, and the implementation of context hooks for state management. Additionally, working with Firebase enhanced my skills in integrating databases with web applications while ensuring data security and accessibility.

## Conclusion
Developing this captive portal allowed me to strengthen my skills in TypeScript, Next.js, Firebase, and styled components while addressing the need for a user-friendly authentication system. The project showcases my ability to build functional and responsive web applications while focusing on scalability and maintainability.

## Testing
Refer to below information for navigating the webpage:

### Guest Login Table

| Full Name      | Room Number | Last Name |
|----------------|-------------|-----------|
| Richard Smith  | 1001        | Smith     |
| Alexis Smith   | 1002        | Smith     |
| Albert Shmuck  | 1005        | Shmuck    |

### Access Code Table

| Access Code | Associated Plan Name       | Duration (minutes) |
|-------------|---------------------------|-----------------|
| 123456      | Standard Voucher Plan      | 30              |
| 111111      | Standard Voucher Plan      | 30              |
| 999999      | Premium Voucher Plan       | 60              |
