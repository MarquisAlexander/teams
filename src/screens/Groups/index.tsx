import { useState } from "react";
import { FlatList } from "react-native";

import { GroupCard } from "@components/GroupCard";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";

import * as S from "./styles";

export function Groups() {
	const [groups, setGroups] = useState<string[]>(["Galera da panelinha", "Somente Backenders"]);

	return (
		<S.Container>
			<Header />
			<Highlight title="Turmar" subTitle="jogue com a sua turma" />
			<FlatList
				data={groups}
				keyExtractor={item => item}
				renderItem={({item}) => (
					<GroupCard
						title={item}
						onPress={() => console.log("click")}
					/>
				)}
			/>
		</S.Container>
	);
}
