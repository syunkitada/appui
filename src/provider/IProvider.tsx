export interface IProvider {
    loginWithToken(input: any): void;
    login(input: any): void;
    logout(input: any): void;
    get_service_index(input: any): void;
    get_queries(input: any): void;
    submit_queries(input: any): void;
}
