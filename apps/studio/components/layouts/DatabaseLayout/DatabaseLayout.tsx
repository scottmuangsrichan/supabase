import { useRouter } from 'next/router'
import { type PropsWithChildren, useEffect } from 'react'

import { ProductMenu } from 'components/ui/ProductMenu'
import { useDatabaseExtensionsQuery } from 'data/database-extensions/database-extensions-query'
import { useProjectAddonsQuery } from 'data/subscriptions/project-addons-query'
import { useSelectedProject, withAuth } from 'hooks'
import { ProjectLayout } from '../'
import { generateDatabaseMenu } from './DatabaseMenu.utils'

import { useRegisterCommands } from 'ui-patterns/CommandMenu'

export interface DatabaseLayoutProps {
  title?: string
}

const DatabaseLayout = ({ children }: PropsWithChildren<DatabaseLayoutProps>) => {
  useRegisterCommands('Database', [
    {
      id: 'database-test',
      name: 'Test database-specific command',
      action: () => alert('databasessssss!!!!'),
    },
  ])

  const project = useSelectedProject()

  const router = useRouter()
  const page = router.pathname.split('/')[4]

  const { data } = useDatabaseExtensionsQuery({
    projectRef: project?.ref,
    connectionString: project?.connectionString,
  })
  const { data: addons } = useProjectAddonsQuery({ projectRef: project?.ref })

  const pgNetExtensionExists = (data ?? []).find((ext) => ext.name === 'pg_net') !== undefined
  const pitrEnabled = addons?.selected_addons.find((addon) => addon.type === 'pitr') !== undefined

  return (
    <ProjectLayout
      product="Database"
      productMenu={
        <ProductMenu
          page={page}
          menu={generateDatabaseMenu(project, { pgNetExtensionExists, pitrEnabled })}
        />
      }
      isBlocking={false}
    >
      <main style={{ maxHeight: '100vh' }} className="flex-1 overflow-y-auto">
        {children}
      </main>
    </ProjectLayout>
  )
}

export default withAuth(DatabaseLayout)
