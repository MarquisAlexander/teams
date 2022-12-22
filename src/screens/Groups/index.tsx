import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { GroupCard } from "@components/GroupCard";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

import { groupsGetAll } from "@storage/group/groupsGetAll";
import * as S from "./styles";

export function Groups() {
	const [groups, setGroups] = useState<string[]>([]);

	const navigation = useNavigation();

	function handleNewGroup() {
		navigation.navigate("new");
	}

	async function fetchGroups() {
		try {
			const data = await groupsGetAll();
			setGroups(data);
		} catch (error) {
			console.log(error);
		}
	}

	useFocusEffect(
		useCallback(() => {
			fetchGroups();
		}, []),
	);

	return (
		<S.Container>
			<Header />
			<Highlight title="Turmas" subTitle="jogue com a sua turma" />
			<FlatList
				data={groups}
				keyExtractor={(item) => item}
				renderItem={({ item }) => (
					<GroupCard title={item} onPress={() => console.log("click")} />
				)}
				contentContainerStyle={groups.length === 0 && { flex: 1 }}
				ListEmptyComponent={() => (
					<ListEmpty message="Que tal cadastrar a primeira turma?" />
				)}
			/>
			<Button title={"Criar nova turma"} onPress={handleNewGroup} />
		</S.Container>
	);
}
