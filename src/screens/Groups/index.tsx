import { useState } from "react";
import { FlatList } from "react-native";

import { GroupCard } from "@components/GroupCard";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";

import * as S from "./styles";
import { ListEmpty } from "@components/ListEmpty";

export function Groups() {
	const [groups, setGroups] = useState<string[]>([
		"Galera da panelinha",
		"Somente Backenders",
	]);

	return (
		<S.Container>
			<Header />
			<Highlight title="Turmar" subTitle="jogue com a sua turma" />
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
		</S.Container>
	);
}
