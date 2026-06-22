import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

let warmed = false;

export async function ensureBackend(): Promise<void> {
  await tf.ready();
  if (!warmed) {
    await tf.backend();
    warmed = true;
  }
}

export { tf };
