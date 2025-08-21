import { HttpHeaders, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import {
  ResourceService,
  HttpMethod,
  RequestOptions,
} from './resource.abstract';

const httpRequestMock = jest.fn();

jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  return {
    ...actual,
    inject: () =>
      ({
        request: httpRequestMock,
      }) as { request: (...args: unknown[]) => unknown },
  };
});

jest.mock('../../../environments/environment', () => ({
  environment: { apiUrl: 'https://api.example.com/' },
}));

describe('ResourceService', () => {
  class TestService extends ResourceService<{ id: number }> {
    constructor(commonHeaders?: Record<string, string>) {
      super('/things/', commonHeaders);
    }
    public buildUrl(...segments: (string | number)[]) {
      return this.url(...segments);
    }
    public callRequest<T>(
      method: HttpMethod,
      url: string,
      options: RequestOptions,
    ) {
      return this.request<T>(method, url, options);
    }
  }

  beforeEach(() => {
    httpRequestMock.mockReset();
  });

  it('builds URLs cleanly (strips slashes and skips empty segments)', () => {
    const svc = new TestService();
    expect(svc.buildUrl()).toBe('https://api.example.com/things');
    expect(svc.buildUrl('users')).toBe('https://api.example.com/things/users');
    expect(svc.buildUrl('/users/', 123)).toBe(
      'https://api.example.com/things/users/123',
    );
    expect(svc.buildUrl('', 0, '///a///')).toBe(
      'https://api.example.com/things/0/a',
    );
  });

  it('normalizes params from a plain record into HttpParams', () => {
    httpRequestMock.mockReturnValue(of([]));
    const svc = new TestService();

    svc.callRequest('GET', svc.buildUrl('users'), {
      params: {
        q: 'test',
        page: 2,
        active: true,
        ignored: null,
        undef: undefined,
      },
      headers: { 'X-Req': 'req' },
    });

    const [, , options] = httpRequestMock.mock.calls[0] as [
      HttpMethod,
      string,
      { params?: HttpParams; headers?: HttpHeaders },
    ];

    expect(options.params instanceof HttpParams).toBe(true);
    expect(options.params?.get('q')).toBe('test');
    expect(options.params?.get('page')).toBe('2');
    expect(options.params?.get('active')).toBe('true');
    expect(options.params?.has('ignored')).toBe(false);
    expect(options.params?.has('undef')).toBe(false);
  });

  it('keeps params as-is when already an HttpParams', () => {
    httpRequestMock.mockReturnValue(of([]));
    const svc = new TestService();
    const original = new HttpParams().set('x', '1');

    svc.callRequest('GET', svc.buildUrl('users'), { params: original });

    const options = httpRequestMock.mock.calls[0][2] as { params?: HttpParams };
    expect(options.params).toBe(original);
    expect(options.params?.get('x')).toBe('1');
  });

  it('merges common and per-request headers (request overrides common)', () => {
    httpRequestMock.mockReturnValue(of([]));
    const svc = new TestService({ 'X-Common': 'one', 'X-Also': 'base' });

    const reqHeaders = new HttpHeaders({ 'X-Common': 'two', 'X-Req': 'three' });
    svc.callRequest('GET', svc.buildUrl(), { headers: reqHeaders });

    const options = httpRequestMock.mock.calls[0][2] as {
      headers?: HttpHeaders;
    };
    expect(options.headers?.get('X-Common')).toBe('two');
    expect(options.headers?.get('X-Also')).toBe('base');
    expect(options.headers?.get('X-Req')).toBe('three');
  });

  it('list() calls GET without body', () => {
    httpRequestMock.mockReturnValue(of([]));
    const svc = new TestService();

    svc.list();

    const [method, url, options] = httpRequestMock.mock.calls[0] as [
      HttpMethod,
      string,
      { body?: unknown },
    ];
    expect(method).toBe('GET');
    expect(url).toBe('https://api.example.com/things');
    expect(options.body).toBeUndefined();
  });

  it('getById() calls GET at /:id without body', () => {
    httpRequestMock.mockReturnValue(of({}));
    const svc = new TestService();

    svc.getById(42);

    const [method, url, options] = httpRequestMock.mock.calls[0] as [
      HttpMethod,
      string,
      { body?: unknown },
    ];
    expect(method).toBe('GET');
    expect(url).toBe('https://api.example.com/things/42');
    expect(options.body).toBeUndefined();
  });

  it('create() calls POST with body', () => {
    httpRequestMock.mockReturnValue(of({}));
    const svc = new TestService();
    const body = { name: 'new' };

    svc.create(body);

    const [method, url, options] = httpRequestMock.mock.calls[0] as [
      HttpMethod,
      string,
      { body?: unknown },
    ];
    expect(method).toBe('POST');
    expect(url).toBe('https://api.example.com/things');
    expect(options.body).toEqual(body);
  });

  it('update() calls PUT with body at /:id', () => {
    httpRequestMock.mockReturnValue(of({}));
    const svc = new TestService();
    const body = { name: 'updated' };

    svc.update(7, body);

    const [method, url, options] = httpRequestMock.mock.calls[0] as [
      HttpMethod,
      string,
      { body?: unknown },
    ];
    expect(method).toBe('PUT');
    expect(url).toBe('https://api.example.com/things/7');
    expect(options.body).toEqual(body);
  });

  it('patch() calls PATCH with body at /:id', () => {
    httpRequestMock.mockReturnValue(of({}));
    const svc = new TestService();
    const body = { active: true };

    svc.patch('abc', body);

    const [method, url, options] = httpRequestMock.mock.calls[0] as [
      HttpMethod,
      string,
      { body?: unknown },
    ];
    expect(method).toBe('PATCH');
    expect(url).toBe('https://api.example.com/things/abc');
    expect(options.body).toEqual(body);
  });

  it('delete() calls DELETE without body at /:id', () => {
    httpRequestMock.mockReturnValue(of({}));
    const svc = new TestService();

    svc.delete('abc');

    const [method, url, options] = httpRequestMock.mock.calls[0] as [
      HttpMethod,
      string,
      { body?: unknown },
    ];
    expect(method).toBe('DELETE');
    expect(url).toBe('https://api.example.com/things/abc');
    expect(options.body).toBeUndefined();
  });
});
