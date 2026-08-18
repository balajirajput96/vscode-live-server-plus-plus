import * as assert from 'assert';

export async function run(): Promise<void> {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
}
