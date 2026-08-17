import * as assert from 'assert';
import { ServerResponse } from 'http';
import { LiveServerPlusPlus } from '../core/LiveServerPlusPlus';
import { isInjectableFile, isSupportedFile } from '../core/utils';
import { fileSelector } from '../extension/middlewares/fileSelector';
import { setMIME } from '../extension/middlewares/setMIME';
import { ILSPPIncomingMessage } from '../core/types';

interface MockResponse extends Partial<ServerResponse> {
    headers: { [name: string]: string };
}

function createMockResponse(): MockResponse {
    return {
        headers: {},
        setHeader(name: string, value: string) {
            this.headers![name.toLowerCase()] = value;
        }
    };
}

suite('Extension behavior', () => {
    test('selects an index file for extensionless requests', () => {
        const request = { url: '/docs?preview=true' } as ILSPPIncomingMessage;
        const response = createMockResponse();

        fileSelector(request, response as ServerResponse);

        assert.strictEqual(request.file, './docs/index.html');
        assert.deepStrictEqual(response.headers, {});
    });

    test('maps regular asset requests to relative disk paths', () => {
        const request = { url: '/styles/site.css' } as ILSPPIncomingMessage;
        const response = createMockResponse();

        fileSelector(request, response as ServerResponse);

        assert.strictEqual(request.file, './styles/site.css');
        assert.deepStrictEqual(response.headers, {});
    });

    test('maps live-server assets and sets a long cache lifetime', () => {
        const request = { url: '/_live-server_/inject.html' } as ILSPPIncomingMessage;
        const response = createMockResponse();

        fileSelector(request, response as ServerResponse);

        assert.ok(request.file!.replace(/\\/g, '/').endsWith('/core/assets/inject.html'));
        assert.strictEqual(response.headers['cache-control'], 'public, max-age=30672000');
    });

    test('sets the MIME type on both the request and response', () => {
        const request = { file: './index.html' } as ILSPPIncomingMessage;
        const response = createMockResponse();

        setMIME(request, response as ServerResponse);

        assert.strictEqual(request.contentType, 'text/html; charset=utf-8');
        assert.strictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
    });

    test('recognizes supported and injectable file types case-insensitively', () => {
        assert.strictEqual(isSupportedFile('/index.HTML'), true);
        assert.strictEqual(isSupportedFile('/styles.CSS'), true);
        assert.strictEqual(isSupportedFile('/app.json'), false);
        assert.strictEqual(isInjectableFile('/index.HTML'), true);
        assert.strictEqual(isInjectableFile('/app.JS'), false);
    });

    test('matches watched index files and exact watched paths', () => {
        const server = new LiveServerPlusPlus({
            cwd: '/tmp/live-server-test',
            indexFile: 'index.html',
            port: 43210
        });

        assert.strictEqual(server.isInWatchingList('/index.html', ['/']), true);
        assert.strictEqual(server.isInWatchingList('/docs/index.html', ['/docs']), true);
        assert.strictEqual(server.isInWatchingList('/docs/about.html', ['/docs/about.html']), true);
        assert.strictEqual(server.isInWatchingList('/other.html', ['/docs/about.html']), false);
    });
});
