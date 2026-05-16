import { Avatar, Group, Modal, ModalProps, ScrollArea, Stack, Table, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@Utils/I18n'
import api, { Blood } from '@Api'
import tableClasses from '@Styles/Table.module.css'

export interface ChallengeSolversModalProps extends ModalProps {
  gameId: number
  challengeId: number
  challengeTitle: string
}

export const ChallengeSolversModal: FC<ChallengeSolversModalProps> = (props) => {
  const { gameId, challengeId, challengeTitle, ...modalProps } = props
  const { t } = useTranslation()
  const { locale } = useLanguage()

  const { data: solvers } = api.game.useGameGetChallengeSolvers(gameId, challengeId, {}, modalProps.opened)

  return (
    <Modal
      {...modalProps}
      title={
        <Stack gap={0}>
          <Title order={4}>{t('challenge.label.solvers')}</Title>
          <Text size="sm" c="dimmed">
            {challengeTitle}
          </Text>
        </Stack>
      }
      size="lg"
    >
      <ScrollArea scrollbarSize={6} h="24rem" w="100%" scrollbars="y">
        <Table className={tableClasses.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('common.label.team')}</Table.Th>
              <Table.Th>{t('common.label.user')}</Table.Th>
              <Table.Th>{t('common.label.time')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {solvers?.map((solver: Blood) => (
              <Table.Tr key={solver.id}>
                <Table.Td>
                  <Group gap="sm" wrap="nowrap">
                    <Avatar src={solver.avatar} size={24} radius="xl">
                      {solver.name?.slice(0, 1) ?? 'T'}
                    </Avatar>
                    <Text size="sm" fw={500}>
                      {solver.name}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {solver.userName}
                  </Text>
                </Table.Td>
                <Table.Td ff="monospace" fz="sm">
                  {dayjs(solver.submitTimeUtc).locale(locale).format('L LTS')}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {!solvers?.length && (
          <Text ta="center" py="xl" fw="bold" c="dimmed">
            {t('challenge.placeholder.no_solver')}
          </Text>
        )}
      </ScrollArea>
    </Modal>
  )
}
