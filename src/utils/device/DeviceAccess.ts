import { terminal } from 'virtual:terminal'

export const askMotionAccess = () => {
  // @ts-ignore
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // @ts-ignore
    DeviceMotionEvent.requestPermission()
      .then((permissionState: string) => {
        if (permissionState === 'granted') {
          terminal.log(
            'Permission to access motion was granted',
            permissionState
          )
          location.reload()
        }
      })
      .catch(terminal.error)
  }
}
