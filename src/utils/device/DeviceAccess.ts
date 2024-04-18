import { terminal } from 'virtual:terminal'

export const askMotionAccess = () => {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then((permissionState) => {
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
