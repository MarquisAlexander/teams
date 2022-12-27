import { useState, useEffect, useRef } from "react";
import { FlatList, Alert, TextInput } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { AppError } from "@utils/AppError";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroup } from "@storage/player/playersGetByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { PlayerCard } from "@components/PlayerCard";
import { Button } from "@components/Button";
import { ListEmpty } from "@components/ListEmpty";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

type RouteParams = {
	group: string;
};

export function Players() {
	const [team, setTeam] = useState("Time A");
	const [newPlayerName, setNewPlayerName] = useState("");
	const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

	const navigation = useNavigation();
	const route = useRoute();
	const { group } = route.params as RouteParams;

	const newPlayerNameInputRef = useRef<TextInput>(null);

	async function handleAddPlayer() {
		if (newPlayerName.trim().length === 0) {
			return Alert.alert(
				"Nova pessoa",
				"Informe o nome da pessoa para adicionar",
			);
		}
		const newPlayer = {
			name: newPlayerName,
			team,
		};

		try {
			await playerAddByGroup(newPlayer, group);

			newPlayerNameInputRef.current?.blur();

			setNewPlayerName("");
			fetchPlayersByTeam();

			const players = await playersGetByGroup(group);
			console.log(players);
		} catch (error) {
			if (error instanceof AppError) {
				Alert.alert("Nova pessoa", error.message);
			} else {
				console.log(error);
				Alert.alert("Nova pessoa", "Não foi possível adicionar");
			}
		}
	}

	async function fetchPlayersByTeam() {
		try {
			const playersByTeam = await playersGetByGroupAndTeam(group, team);
			setPlayers(playersByTeam);
		} catch (error) {
			console.log(error);
			Alert.alert(
				"Pessoas",
				"Não foi possível carregar as pessoas do time selecionado",
			);
		}
	}

	async function handlePlayerRemove(playerName: string) {
		try {
			await playerRemoveByGroup(playerName, group);
			fetchPlayersByTeam();
		} catch (error) {
			console.log(error);
			Alert.alert("Remover pessoa", "não foi possível remover essa pessoa.");
		}
	}

	async function groupRemove() {
		try {
			await groupRemoveByName(group);

			navigation.navigate("groups");
		} catch (error) {
			console.log(error);
			Alert.alert("Remover grupo", "Não foi possível remover o grupo");
		}
	}

	async function handleGroupRemove() {
		Alert.alert("Remover", "Deseja remover o grupo?", [
			{ text: "Não", style: "cancel" },
			{ text: "Sim", onPress: () => groupRemove() },
		]);
	}

	useEffect(() => {
		fetchPlayersByTeam();
	}, [team]);

	return (
		<Container>
			<Header showBackButton />

			<Highlight title={group} subTitle="adicione a galera e separe os times" />

			<Form>
				<Input
					inputRef={newPlayerNameInputRef}
					placeholder="Nome da pessoa"
					autoCorrect={false}
					onChangeText={setNewPlayerName}
					value={newPlayerName}
					onSubmitEditing={handleAddPlayer}
					returnKeyType="done"
				/>
				<ButtonIcon icon="add" onPress={handleAddPlayer} />
			</Form>

			<HeaderList>
				<FlatList
					data={["Time A", "Time B"]}
					keyExtractor={(item) => item}
					renderItem={({ item }) => (
						<Filter
							title={item}
							isActive={item === team}
							onPress={() => setTeam(item)}
						/>
					)}
					horizontal
				/>
				<NumberOfPlayers>{players.length}</NumberOfPlayers>
			</HeaderList>

			<FlatList
				data={players}
				keyExtractor={(item) => item.name}
				renderItem={({ item }) => (
					<PlayerCard
						name={item.name}
						onRemove={() => handlePlayerRemove(item.name)}
					/>
				)}
				ListEmptyComponent={() => (
					<ListEmpty message="Não há pessoas nesse time" />
				)}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[
					{ paddingBottom: 100 },
					players.length === 0 && { flex: 1 },
				]}
			/>

			<Button
				title="Remover Turma"
				type="SECONDARY"
				onPress={handleGroupRemove}
			/>
		</Container>
	);
}
