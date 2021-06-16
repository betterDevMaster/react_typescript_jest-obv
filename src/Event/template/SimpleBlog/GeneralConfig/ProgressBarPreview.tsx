import React from 'react'
import ProgressBar, {ProgressBarProps} from 'lib/ui/ProgressBar'

export default function ProgressBarPreview(
  props: Omit<ProgressBarProps, 'value'>,
) {
  const [progress, setProgress] = React.useState(10)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10,
      )
    }, 800)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return <ProgressBar {...props} value={progress} />
}
