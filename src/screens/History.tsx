import { useCallback, useState } from "react";
import { SectionList } from "react-native";
import { Heading, Text, VStack, useToast } from "@gluestack-ui/themed";

import { api } from "@services/api";
import { ToastMessage } from "@components/ToastMessage";
import { AppError } from "@utils/AppError";

import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";

import { useFocusEffect } from "@react-navigation/native";

import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

export function History() {
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

    const toast = useToast();

    async function fetchHistory() {
        try {
            setIsLoading(true);

            const response = await api.get('/history');
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar o histórico.'

            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <ToastMessage
                        id={id}
                        action="error"
                        title={title}
                        onClose={() => toast.close(id)}
                    />
                )
            });
        } finally {
            setIsLoading(false);
        }
    }
    useFocusEffect(useCallback(() => {
        fetchHistory();
    }, []))

    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de Exercícios" />

            <SectionList
                sections={exercises}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <HistoryCard data={item} />}
                renderSectionHeader={({ section }) => (
                    <Heading
                        fontFamily="$heading"
                        color="$gray200"
                        fontSize="$md"
                        mt="$10"
                        mb="$3"
                    >
                        {section.title}
                    </Heading>
                )}
                style={{ paddingHorizontal: 32 }}
                contentContainerStyle={
                    exercises.length === 0 && { flex: 1, justifyContent: "center" }
                }
                ListEmptyComponent={() => (
                    <Text color="$gray100" textAlign="center">
                        Não há exercícios registrados ainda. {"\n"}
                        Vamos fazer exercícios hoje?
                    </Text>
                )}
                showsVerticalScrollIndicator={false}
            />
        </VStack>
    );
}