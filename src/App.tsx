import React, {useState} from 'react'
import Dashboard from 'Dashboard'
import ThemeProvider from 'system/ui/theme/ThemeProvider'
import {fakeSimpleBlog} from 'Dashboard/templates/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import {fakePoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import {fakeNavButton} from 'Dashboard/components/NavButton/__utils__/factory'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'

function App() {
  const [tab, setTab] = React.useState(0)

  const [dashboard, setDashboard] = useState(
    fakeSimpleBlog({
      primaryColor: '#ea202e',
      points: fakePoints(),
      sidebar: {
        background: '#000000',
        textColor: '#Ffffff',
        navButtons: Array.from({length: 5}, fakeNavButton),
      },
    }),
  )

  const handleChangeTab = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }

  const handleChangeDashboard = (
    input: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setDashboard(JSON.parse(input.target.value))
    } catch (e) {
      //
    }
  }

  return (
    <>
      <AppBar position="static">
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          aria-label="simple tabs example"
          centered
        >
          <Tab label="Preview" />
          <Tab label="Edit" />
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={0}>
        <ThemeProvider>
          <Dashboard
            // @ts-ignore
            dashboard={dashboard}
            // @ts-ignore
            user={fakeUser()}
          />
        </ThemeProvider>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Box p={5}>
          <TextField
            multiline
            rows={30}
            fullWidth
            variant="outlined"
            value={JSON.stringify(dashboard, undefined, 2)}
            onChange={handleChangeDashboard}
          />
        </Box>
      </TabPanel>
    </>
  )
}

function TabPanel(props: {children: React.ReactNode; index: any; value: any}) {
  const {children, value, index, ...other} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  )
}

export default App
