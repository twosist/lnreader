import React, { useState } from "react";
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    Image,
    FlatList,
    Share,
} from "react-native";
import { TouchableRipple, IconButton, Button, Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { theme } from "../theming/theme";

const NovelInfoHeader = ({
    item,
    novel,
    libraryStatus,
    noOfChapters,
    insertToLibrary,
    navigatingFrom,
    loading,
}) => {
    const navigation = useNavigation();

    const [more, setMore] = useState(navigatingFrom === 2 ? true : false);

    const onShare = async (uri) => {
        Share.share({
            message: uri,
        });
    };

    const renderGenreChip = ({ item }) => (
        <Text
            style={[
                styles.genre,
                {
                    color: theme.colorAccentDark,
                    borderColor: theme.colorAccentDark,
                },
            ]}
        >
            {item}
        </Text>
    );

    return (
        <>
            <ImageBackground
                source={{
                    uri: item.novelCover,
                }}
                style={styles.background}
            >
                <LinearGradient
                    colors={["rgba(0,0,0,0.1)", "#000000"]}
                    style={styles.linearGradient}
                >
                    <View style={styles.detailsContainer}>
                        <View>
                            <Image
                                source={{
                                    uri: item.novelCover,
                                }}
                                style={styles.logo}
                            />
                        </View>
                        <View style={styles.nameContainer}>
                            <Text
                                numberOfLines={2}
                                style={[
                                    styles.name,
                                    {
                                        color: theme.textColorPrimaryDark,
                                    },
                                ]}
                            >
                                {item.novelName}
                            </Text>
                            <Text
                                style={{
                                    color: theme.textColorSecondaryDark,
                                    marginVertical: 3,
                                    fontSize: 14,
                                    fontWeight: "bold",
                                }}
                            >
                                {novel["Author(s)"] &&
                                    novel["Author(s)"].replace(",", ", ")}
                            </Text>

                            <Text
                                style={{
                                    color: theme.textColorSecondaryDark,
                                    marginVertical: 3,
                                    fontSize: 14,
                                }}
                                numberOfLines={1}
                            >
                                {novel["Status"] &&
                                    novel["Type"] &&
                                    novel["Status"] + " • " + novel["Type"]}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
            {!loading && (
                <>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Chip
                            mode="outlined"
                            icon={() => (
                                <MaterialCommunityIcons
                                    name={
                                        navigatingFrom !== 1 ||
                                        libraryStatus === 0
                                            ? "bookmark-outline"
                                            : "bookmark"
                                    }
                                    size={21}
                                    color={theme.colorAccentDark}
                                />
                            )}
                            onPress={() => insertToLibrary()}
                            iconColor="pink"
                            style={[
                                {
                                    backgroundColor: "transparent",
                                    marginRight: 2,
                                    borderColor: "rgba(255,255,255,0.121)",
                                    borderWidth: 1,
                                    justifyContent: "center",
                                    height: 30,
                                    alignItems: "center",
                                    marginLeft: 15,
                                },
                                libraryStatus === 1
                                    ? {
                                          width: 120,
                                          backgroundColor:
                                              "rgba(41,121,255,0.38)",
                                      }
                                    : {
                                          width: 150,
                                      },
                            ]}
                            textStyle={{
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            {navigatingFrom === 1 || libraryStatus === 1
                                ? "In Library"
                                : "Add to library"}
                        </Chip>
                        <IconButton
                            onPress={() =>
                                WebBrowser.openBrowserAsync(
                                    novel.sourceUrl && novel.sourceUrl
                                )
                            }
                            icon="earth"
                            color={theme.colorAccentDark}
                            size={21}
                        />
                        <IconButton
                            onPress={() =>
                                onShare(novel.sourceUrl && novel.sourceUrl)
                            }
                            icon="share-variant"
                            color={theme.colorAccentDark}
                            size={21}
                        />
                    </View>

                    {novel.novelSummary && novel.novelSummary.length > 0 && (
                        <View
                            style={{
                                paddingHorizontal: 15,
                                marginBottom: 10,
                                marginTop: 5,
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.textColorPrimaryDark,
                                    marginTop: 5,
                                    paddingVertical: 5,
                                    fontSize: 15,
                                    fontWeight: "bold",
                                }}
                            >
                                About
                            </Text>
                            <Text
                                style={{
                                    color: theme.textColorSecondaryDark,
                                    lineHeight: 20,
                                }}
                                numberOfLines={more ? 100 : 2}
                                onPress={() => setMore(!more)}
                                ellipsizeMode="clip"
                            >
                                {novel.novelSummary}
                            </Text>
                            <Text
                                style={{
                                    color: theme.colorAccentDark,
                                    fontWeight: "bold",
                                    position: "absolute",
                                    bottom: 0,
                                    right: 15,
                                    backgroundColor: "black",
                                    paddingLeft: 5,
                                }}
                                onPress={() => setMore(!more)}
                            >
                                {more ? "Less" : "More"}
                            </Text>
                        </View>
                    )}
                    {more && (
                        <FlatList
                            contentContainerStyle={{
                                paddingHorizontal: 15,
                                marginBottom: 15,
                            }}
                            horizontal
                            data={
                                novel["Genre(s)"] &&
                                novel["Genre(s)"].split(",")
                            }
                            keyExtractor={(item) => item}
                            renderItem={renderGenreChip}
                        />
                    )}

                    <Button
                        color={theme.textColorPrimaryDark}
                        style={{
                            backgroundColor: theme.colorAccentDark,
                            marginHorizontal: 15,
                            marginTop: 8,
                            marginBottom: 15,
                        }}
                        uppercase={false}
                        labelStyle={{ letterSpacing: 0 }}
                        onPress={() =>
                            navigation.navigate("ChapterItem", {
                                chapterUrl: novel.lastRead,
                                novelUrl: novel.novelUrl,
                                extensionId: novel.extensionId,
                            })
                        }
                    >
                        {novel.unread && novel.unread === 0
                            ? "Start reading"
                            : "Continue reading"}
                    </Button>

                    <TouchableRipple
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingRight: 15,
                        }}
                        onPress={() => _panel.show({ velocity: -1.5 })}
                        rippleColor={theme.rippleColorDark}
                    >
                        <>
                            <Text
                                style={{
                                    color: theme.textColorPrimaryDark,
                                    paddingHorizontal: 15,
                                    paddingVertical: 5,
                                    fontSize: 15,
                                    fontWeight: "bold",
                                }}
                            >
                                {noOfChapters && noOfChapters + "  Chapters  "}
                            </Text>
                            <IconButton
                                icon="filter-variant"
                                color={theme.colorAccentDark}
                                size={24}
                            />
                        </>
                    </TouchableRipple>
                </>
            )}
        </>
    );
};

export default NovelInfoHeader;

const styles = StyleSheet.create({
    nameContainer: {
        flex: 1,
        marginHorizontal: 15,
        paddingTop: 10,
    },
    background: {
        height: 285,
    },
    linearGradient: {
        flex: 1,
        backgroundColor: "rgba(256, 256, 256, 0.5)",
    },
    detailsContainer: {
        flex: 1,
        flexDirection: "row",
        margin: 15,
        paddingTop: 80,
    },
    logo: {
        height: 160,
        width: 110,
        margin: 3.2,
        borderRadius: 6,
    },
    genre: {
        borderRadius: 50,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginHorizontal: 2,
        fontSize: 13,
        paddingVertical: 2,
        justifyContent: "center",
        flex: 1,
    },
    name: {
        fontWeight: "bold",
        fontSize: 18,
    },
});