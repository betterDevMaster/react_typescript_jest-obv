import {calculateViewport} from 'lib/ui/form/ImageUpload/Cropper'

it('should calculate viewport sizes', () => {
  /**
   * Both below limits...
   */
  expect(calculateViewport(300, 300)).toMatchObject({
    width: 300,
    height: 300,
  })

  /**
   * Height exceed maximum
   */

  expect(calculateViewport(300, 1200)).toMatchObject({
    width: 100,
    height: 400,
  })

  /**
   * Width exceed maximum
   */

  expect(calculateViewport(1200, 400)).toMatchObject({
    width: 600,
    height: 200,
  })

  /**
   * Both exceed maximum
   */

  expect(calculateViewport(900, 1200)).toMatchObject({
    width: 300,
    height: 400,
  })
})
