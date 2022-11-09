import { GroupCard } from "@components/GroupCard";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";

import * as S from "./styles";

export function Groups() {
	return (
		<S.Container>
			<Header />
			<Highlight title="Turmar" subTitle="jogue com a sua turma"/>
			<GroupCard title="Galera da panelinha" onPress={() => console.log('click')}/>
		</S.Container>
	);
}
