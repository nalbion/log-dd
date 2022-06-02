// Allow `uuid.v4()` to be mocked in uuid@7
const _defineProperty = Object.defineProperty;
let _v4: () => string;
Object.defineProperty = (obj, prop, descriptor) => {
  if (prop === 'v4') {
    descriptor.configurable = true;
    if (!_v4) {
      _v4 = descriptor.value;
    }
  }

  return _defineProperty(obj, prop, descriptor);
};

import sinon, { SinonFakeTimers } from 'sinon';
import * as uuid from 'uuid';

let mocked = false;
let clock: SinonFakeTimers;

export const setupMocks = () => {
  if (mocked) {
    return;
  }

  mocked = true;

  const uuids = ['c23624e9-e21d-4f19-8853-cfca73e7109a', '804759ea-d5d2-4b30-b79d-98dd4bfaf053', '7aa53488-ad43-4467-aa3d-a97fc3bc90b8'];
  Object.defineProperty(uuid, 'v4', { value: () => uuids.shift() });

  const now = new Date('2000-03-28T02:59:45.000Z');
  clock = sinon.useFakeTimers(now.getTime());
};

export const restoreMocks = () => {
  if (!mocked) {
    return;
  }

  clock.restore();

  Object.defineProperty(uuid, 'v4', { value: _v4 });
  Object.defineProperty = _defineProperty;
  mocked = false;
};
