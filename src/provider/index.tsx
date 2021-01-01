import goapp from "./goapp";
import { IProvider } from "./IProvider";

class Provider {
    provider: IProvider = new goapp.Provider();

    register(provider: IProvider): void {
        this.provider = provider;
    }

    loginWithToken(input: any): void {
        return this.provider.loginWithToken(input);
    }

    login(input: any): void {
        return this.provider.login(input);
    }

    logout(input: any): void {
        return this.provider.logout(input);
    }

    get_service_index(input: any): void {
        return this.provider.get_service_index(input);
    }

    get_queries(input: any): void {
        return this.provider.get_queries(input);
    }
}

const provider = new Provider();

export default provider;
