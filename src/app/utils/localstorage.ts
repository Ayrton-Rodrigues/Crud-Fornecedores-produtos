
export class LocalStorageUtils {



    public obterUsuario() {
        return JSON.parse(localStorage.getItem('devio.user') as string);
  }

    public salvarDadosLocaisUsuario(response: any) {
        this.salvarTokenUsuario(response.accessToken);
        this.salvarUsuario(response.userToken);
    }

    public limparDadosLocaisUsuario() {
        localStorage.removeItem('devio.token');
        localStorage.removeItem('devio.user');
        localStorage.removeItem('access_token')
    }

    public obterTokenUsuario(): string{
        return localStorage.getItem('devio.token') as string;
    }

    public salvarTokenUsuario(token: string) {
        localStorage.setItem('devio.token', token);
    }

    public salvarUsuario(user: string) {
        localStorage.setItem('devio.user', JSON.stringify(user));
    }

}
