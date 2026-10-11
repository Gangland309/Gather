import test from 'node:test';
import assert from 'node:assert/strict';
import {mentionTokens} from '../mobile/mention-tokens.mjs';
test('mention token boundaries preserve handles, punctuation and source offsets',()=>{const body='Hi (@ALICE), @bob!\n@person_123? Email hi@alice.com and https://example.com/@bob and @alice.com and @abcdefghijklmnopqrstuvwxyz';const tokens=mentionTokens(body);assert.deepEqual(tokens.map(t=>t.username),['alice','bob','person_123']);assert.deepEqual(tokens.map(t=>body.slice(t.start,t.end)),['@ALICE','@bob','@person_123']);assert.deepEqual(mentionTokens('@bob @bob').map(t=>t.username),['bob','bob']);});
