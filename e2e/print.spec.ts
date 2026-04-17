import { test, expect } from '@playwright/test'

/**
 * Print page smoke tests.
 * 認証が必要なため未認証時のルーティング挙動のみ検証する。
 * フル動作確認は本番環境で手動ログイン後に実施。
 */
test.describe('/lectures/print route smoke', () => {
  test('GET /lectures/print without params → redirects (unauth)', async ({
    request,
  }) => {
    const res = await request.get('/lectures/print', {
      maxRedirects: 0,
      failOnStatusCode: false,
    })
    expect([307, 308, 302]).toContain(res.status())
  })

  test('GET /lectures/print?unit=U01 → redirects (unauth)', async ({
    request,
  }) => {
    const res = await request.get('/lectures/print?unit=U01', {
      maxRedirects: 0,
      failOnStatusCode: false,
    })
    expect([307, 308, 302]).toContain(res.status())
  })

  test('GET /lectures/print?all=true → redirects (unauth)', async ({
    request,
  }) => {
    const res = await request.get('/lectures/print?all=true', {
      maxRedirects: 0,
      failOnStatusCode: false,
    })
    expect([307, 308, 302]).toContain(res.status())
  })

  test('GET /lectures/print?unit=INVALID → redirects or 404', async ({
    request,
  }) => {
    const res = await request.get('/lectures/print?unit=INVALID', {
      maxRedirects: 0,
      failOnStatusCode: false,
    })
    expect([307, 308, 302, 404]).toContain(res.status())
  })

  test('GET /lectures/print → no 5xx error', async ({ request }) => {
    const res = await request.get('/lectures/print', {
      maxRedirects: 0,
      failOnStatusCode: false,
    })
    expect(res.status()).toBeLessThan(500)
  })
})

test.describe('/lectures routes smoke', () => {
  test('GET /lectures → redirects (unauth)', async ({ request }) => {
    const res = await request.get('/lectures', {
      maxRedirects: 0,
      failOnStatusCode: false,
    })
    expect([307, 308, 302]).toContain(res.status())
  })

  test('GET /lectures/U01 → redirects (unauth)', async ({ request }) => {
    const res = await request.get('/lectures/U01', {
      maxRedirects: 0,
      failOnStatusCode: false,
    })
    expect([307, 308, 302]).toContain(res.status())
  })
})
