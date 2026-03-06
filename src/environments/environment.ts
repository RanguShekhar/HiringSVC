export const environment = {
    production: false,
    azureConfig: {
        clientId: 'a5c00f4d-3cce-4874-b393-a39158631c61', // To be replaced by user
        authority: 'https://login.microsoftonline.com/a8bef25d-4fab-408d-9a0f-8864a14730ac',
        redirectUri: 'http://localhost:4200',
        scopes: ['user.read']
    },
    apiUrl: 'https://hirningsvc-dfhkhwhse8g5ceh2.eastus2-01.azurewebsites.net/api'//'https://localhost:7021/api' // To be replaced by user
};
