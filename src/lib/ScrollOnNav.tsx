import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

/**
 * Watcher component that will automatically scroll to top of the page on
 * any page/route nav (like a normal browser page nav). This fixes an
 * issue where users would navigate to the middle of pages.
 *
 * @param props
 * @returns
 */
export default function ScrollOnNav() {
  const {pathname} = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
