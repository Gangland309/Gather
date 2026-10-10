import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveSpeakerFocus} from '../mobile/live-layout.ts';
test('host direction overrides personal focus and clearing restores available viewer choice',()=>{assert.equal(resolveSpeakerFocus(null,'alice',['alice','bob']),'alice');assert.equal(resolveSpeakerFocus('bob','alice',['alice','bob']),'bob');assert.equal(resolveSpeakerFocus(null,'alice',['alice','bob']),'alice');assert.equal(resolveSpeakerFocus(null,'alice',['bob']),null);assert.equal(resolveSpeakerFocus(null,null,['alice','bob']),null);});
