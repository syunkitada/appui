import goapp from "./goapp";
import { IProvider } from "./IProvider";

class Provider {
    provider: IProvider = new goapp.Provider();
    data: any;

    register(provider: IProvider): void {
        this.provider = provider;
        this.data = provider.getInitData({});
    }

    getDefaultServiceName(): any {
        return this.data.DefaultServiceName;
    }

    getDefaultProjectServiceName(): any {
        return this.data.DefaultProjectServiceName;
    }

    getLogo(): any {
        return this.data.Logo;
    }

    getLoginView(input: any): any {
        return this.data.LoginView;
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
