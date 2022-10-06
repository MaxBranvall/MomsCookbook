# Moms Cookbook

Disclaimer: The desktop UI is currently rough around the edges as I mainly focused on writing the mobile UI on this site.

## Tech Stack
- Front-end: Angular
- Back-end: .NET Core REST API
- Database: MySQL

## Features
- Account creation with password reset.
- Admins can add, update, and delete recipes from the site.
- Any visitor can view recipes

## Known issues
 - Desktop site layout as mentioned above
 - Emailed link to reset password does not include base URL. To work around this, append the link included in the email to the URL. For example: https://momscookbook.netlify.app/#/{EMAILED_LINK_PASTED_HERE_WITHOUT_LEADING_SLASH}

## Dependencies
- .NET Core SDK >= 3.0 [.NET download page](https://dotnet.microsoft.com/download/dotnet-core)
- MySQL >= 8.0.19 [MySQL downloads page](https://dev.mysql.com/downloads/)
- Angular >= 10.1.1 [Angular installation instructions here](https://angular.io/guide/setup-local)
- Node.js >= 10.19.0 [Nodejs download page](https://nodejs.org/en/)

## Development
- WIP

## Contributing
- WIP
