import { RunningType } from './types/manager';
import detox from 'detox';
export const IS_ANDROID = detox.device.getPlatform() === RunningType.ANDROID;

export const IS_IOS = detox.device.getPlatform() === RunningType.IOS;

export const RUNNING_TYPE = detox.device.getPlatform() === RunningType.ANDROID ? RunningType.ANDROID : RunningType.IOS;
