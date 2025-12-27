import env from '../../env/env.service';
import getCookie from '../../cookie/cookie.service';

const baseUrl = env.base_url + '/api';

class SecretariatApi {
  private async request(url: string, options: RequestInit = {}) {
    try {
      const accessTokenCookie = getCookie('_token');
      const accessToken = accessTokenCookie || env.accessTokenTest;

      const defaultHeaders = {
        'Authorization': 'Bearer ' + accessToken,
        'Accept': 'application/json',
      };

      options.headers = {
        ...defaultHeaders,
        ...(options.headers || {}),
      };

      const res = await fetch(baseUrl + url, options);

      return await res.json();
    } catch (err: any) {
      return err;
    }
  }

  get(url: string) {
    return this.request(url, { method: 'GET' });
  }

  post(url: string, body: any) {
    return this.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  patch(url: string, body: any) {
    return this.request(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  put(url: string, body: any) {
    return this.request(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  delete(url: string) {
    return this.request(url, { method: 'DELETE' });
  }
}

export const secretariatApi = new SecretariatApi();
