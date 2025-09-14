import './App.css'
import { useState } from 'react'
import { TopNavigation } from './components/top-navigation'
import { Header } from './components/header'
import { AppTitle } from './components/app-title'
import { LeadsDataTable } from './features/leads/leads-data-table'
import { OpportunitiesPage } from './features/opportunities/opportunities-page'

function App() {
  const [currentPage, setCurrentPage] = useState('leads')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'leads':
        return <LeadsDataTable />
      case 'opportunities':
        return <OpportunitiesPage />
      default:
        return <LeadsDataTable />
    }
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case 'leads':
        return 'Leads'
      case 'opportunities':
        return 'Opportunities'
      default:
        return 'Leads'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex flex-col">
        <Header>
          <AppTitle title={getPageTitle()} />
        </Header>
        <main className="flex-1 p-6">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  )
}

export default App
