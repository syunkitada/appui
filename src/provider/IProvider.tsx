export interface IProvider {
    loginWithToken(input: any): void;
    login(input: any): void;
    logout(input: any): void;
    getServiceIndex(input: any): void;
    getQueries(input: any): void;
    submitQueries(input: any): void;
}
