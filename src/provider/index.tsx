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

    getServiceIndex(input: any): void {
        return this.provider.getServiceIndex(input);
    }

    getQueries(input: any): void {
        return this.provider.getQueries(input);
    }

    submitQueries(input: any): void {
        return this.provider.submitQueries(input);
    }
}

const provider = new Provider();

export default provider;
