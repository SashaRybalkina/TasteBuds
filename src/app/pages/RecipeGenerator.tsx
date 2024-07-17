import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import {
  NavigationProp,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {
  Check,
  ChevronDown,
  ChevronUp,
  CornerDownLeft,
  Divide,
} from '@tamagui/lucide-icons';
import OpenAI from 'openai';
import {
  Adapt,
  Button,
  FontSizeTokens,
  getFontSize,
  Label,
  Select,
  SelectProps,
  Sheet,
  XStack,
  YStack,
} from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

type Props = {
  navigation: NavigationProp<any>;
};

// export function SelectDemo() {
//   return (
//     <YStack gap="$4">
//       <XStack ai="center" gap="$4">
//         {/* <Label htmlFor="select-demo-1" f={1} miw={80}>
//           Custom
//         </Label> */}
//         <SelectDemoItem id="select-demo-1" />
//       </XStack>

//       {/* <XStack ai="center" gap="$4">
//         <Label htmlFor="select-demo-2" f={1} miw={80}>
//           Native
//         </Label>
//         <SelectDemoItem id="select-demo-2" native />
//       </XStack> */}
//     </YStack>
//   )
// }

// const items: { name: string }[] = [
//   { name: '1' },
//   { name: '2' },
//   { name: '3' },
//   { name: '4' },
//   { name: '5' },
//   { name: '6' },
//   { name: '7' },
//   { name: '8' },
//   { name: '9' },
//   { name: '10' },
// ];

// let selectedItem: string = items.length > 0 ? items[0]?.name || '' : '';
// const setSelectedItem = (value: string) => {
//   selectedItem = value;
// };

// export function SelectDemoItem(props: SelectProps) {

//   // const [selectedItem, setSelectedItem] = useState(items.length > 0 ? items[0]?.name || '' : '');

//   const handleValueChange = (value: string) => {
//     setSelectedItem(value);
//     console.log(value);
//     // Handle any other logic you need here when the value changes
//   };

//   return (
//     <View>
//       <Select value={selectedItem}
//         onValueChange={handleValueChange}
//         disablePreventBodyScroll
//         {...props}>
//         <Select.Trigger width={80} style={[styles.preferenceButton, {borderRadius: 15}]}>
//         <Select.Value placeholder="Something" style={{ color: '#FFF5CD' }} />
//         <ChevronDown size={20} color = '#FFF5CD' />
//         </Select.Trigger>

//         <Adapt when="sm" platform="touch">
//           <Sheet
//             native={!!props.native}
//             modal
//             dismissOnSnapToBottom
//             animationConfig={{
//               type: 'spring',
//               damping: 20,
//               mass: 1.2,
//               stiffness: 250,
//             }}
//           >
//             <Sheet.Frame>
//               <Sheet.ScrollView>
//                 <Adapt.Contents />
//               </Sheet.ScrollView>
//             </Sheet.Frame>
//             <Sheet.Overlay
//               animation="lazy"
//               enterStyle={{ opacity: 0 }}
//               exitStyle={{ opacity: 0 }}
//             />
//           </Sheet>
//         </Adapt>

//         <Select.Content zIndex={200000}>
//           <Select.ScrollUpButton
//             alignItems="center"
//             justifyContent="center"
//             position="relative"
//             width="100%"
//             height="$3"
//           >
//             <YStack zIndex={10}>
//               <ChevronUp size={20} />
//             </YStack>
//             <LinearGradient
//               start={{ x: 0, y: 0 }}
//               end={{ x: 0, y: 1 }}
//               colors={['$background', 'transparent']}
//               style={{ borderRadius: 4 }}
//             />
//           </Select.ScrollUpButton>

//           <Select.Viewport
//             // to do animations:
//             // animation="quick"
//             // animateOnly={['transform', 'opacity']}
//             // enterStyle={{ o: 0, y: -10 }}
//             // exitStyle={{ o: 0, y: 10 }}
//             minWidth={200}
//           >
//             <Select.Group>
//               <Select.Label>Yield</Select.Label>
//               {/* for longer lists memorizing these is useful */}
//               {useMemo(
//                 () =>
//                   items.map((item, i) => {
//                     return (
//                       <Select.Item
//                         index={i}
//                         key={item.name}
//                         value={item.name.toLowerCase()}
//                       >
//                         <Select.ItemText>{item.name}</Select.ItemText>
//                         <Select.ItemIndicator marginLeft="auto">
//                           <Check size={16} />
//                         </Select.ItemIndicator>
//                       </Select.Item>
//                     )
//                   }),
//                 [items]
//               )}
//             </Select.Group>
//             {/* Native gets an extra icon */}
//             {props.native && (
//               <YStack
//                 position="absolute"
//                 right={0}
//                 top={0}
//                 bottom={0}
//                 alignItems="center"
//                 justifyContent="center"
//                 width={'$4'}
//                 pointerEvents="none"
//               >
//                 <ChevronDown color='#FFF5CD'
//                   size={getFontSize((props.size as FontSizeTokens) ?? '$true')}
//                 />
//               </YStack>
//             )}
//           </Select.Viewport>

//           <Select.ScrollDownButton
//             alignItems="center"
//             justifyContent="center"
//             position="relative"
//             width="100%"
//             height="$3"
//           >
//             <YStack zIndex={10}>
//               <ChevronDown size={20}  color='#FFF5CD' />
//             </YStack>
//             <LinearGradient
//               start={[0, 0]}
//               end={[0, 1]}
//               fullscreen
//               colors={['transparent', '$background']}
//               borderRadius="$4"
//             />
//           </Select.ScrollDownButton>
//         </Select.Content>
//       </Select>
//     </View>

//   )
// }

const RecipeGenerator: React.FC<Props> = ({ navigation }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [applianceArray, setApplianceArray] = useState<string[]>([]);
  const [applianceString, setApplianceString] = useState<string | null>(null);
  const [complexityLevel, setComplexityLevel] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string>('');
  const [diet, setDiet] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [servingsAmount, setServingsAmount] = useState(1);
  const [generateRecipeBoolean, setGenerateRecipeBoolean] = useState<
    boolean | null
  >(null);

  const [generatedRecipeTitle, setGeneratedRecipeTitle] = useState<
    string | null
  >(null);
  const [generatedRecipeDescription, setGeneratedRecipeDescription] = useState<
    string | null
  >(null);
  const [generatedRecipeServingsAmount, setGeneratedRecipeServingsAmount] =
    useState<number | null>(null);
  const [generatedRecipeTimeAmount, setGeneratedRecipeTimeAmount] = useState<
    string | null
  >(null);

  //Might need to make time into a number measured in minutes and then convert it into a string
  const [generatedRecipeComplexityLevel, setGeneratedRecipeComplexityLevel] =
    useState<string | null>(null);
  const [generatedRecipeIngredients, setGeneratedRecipeIngredients] = useState<
    string[]
  >([]);
  const [generatedRecipeDirections, setGeneratedRecipeDirections] = useState<
    string[]
  >([]);
  const [
    generatedRecipeCaloriesPerServing,
    setGeneratedRecipeCaloriesPerServing,
  ] = useState<string | null>(null);
  const [generatedRecipeTotalFat, setGeneratedRecipeTotalFat] = useState<
    string | null
  >(null);
  const [generatedRecipeSodium, setGeneratedRecipeSodium] = useState<
    string | null
  >(null);
  const [generatedRecipeDietaryFiber, setGeneratedRecipeDietaryFiber] =
    useState<string | null>(null);
  const [generatedRecipeProtein, setGeneratedRecipeProtein] = useState<
    string | null
  >(null);
  const [generatedRecipeVitaminC, setGeneratedRecipeVitaminC] = useState<
    string | null
  >(null);
  const [generatedRecipePotassium, setGeneratedRecipePotassium] = useState<
    string | null
  >(null);
  const [generatedRecipeCholesterol, setGeneratedRecipeCholesterol] = useState<
    string | null
  >(null);
  const [generatedRecipeTotalCarb, setGeneratedRecipeTotalCarb] = useState<
    string | null
  >(null);
  const [generatedRecipeSugars, setGeneratedRecipeSugars] = useState<
    string | null
  >(null);
  const [generatedRecipeVitaminA, setGeneratedRecipeVitaminA] = useState<
    string | null
  >(null);
  const [generatedRecipeIron, setGeneratedRecipeIron] = useState<string | null>(
    null,
  );
  const [generatedRecipePhosphorus, setGeneratedRecipePhosphorus] = useState<
    string | null
  >(null);

  const route = useRoute();
  const { userId } = route.params as {
    userId: string;
  };

  useEffect(() => {
    resetState();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      resetState();
    }, []),
  );

  const resetState = () => {
    setSelectedMeal(null);
    setSelectedTime(null);
    setApplianceArray([]);
    setComplexityLevel(null);
    setIngredients('');
    setDiet('');
    setShowError(false);
    setGenerateRecipeBoolean(false);
    setServingsAmount(1);
  };

  const userPreferencePage = () => {
    return (
      <View>
        {/* !selectedTime */}
        <TouchableOpacity onPress={() => setSelectedMeal(null)}>
          <MaterialIcons name="arrow-back-ios" size={30} color="#FFF5CD" />
        </TouchableOpacity>

        <View style={{ height: 30 }} />
        <Text style={styles.modalTitle}>Ok, now what are we working with?</Text>
        <View style={{ height: 20 }} />

        <XStack style={styles.row}>
          <Text style={styles.modalTitleSmaller}>Ingredients</Text>
          <View style={{ width: 7 }} />
          <Text style={styles.modalText}>include quantity (e.g. 2 eggs)</Text>
        </XStack>

        <TextInput
          style={styles.input}
          placeholder="1 gal of milk, 3 potatoes, 2 sticks of butter, etc"
          placeholderTextColor="#AFA26B"
          value={ingredients}
          onChangeText={(text) => setIngredients(text)}
        />

        <TouchableOpacity style={styles.uploadImageButton}>
          <Ionicons name="link" size={20} color={'#FFF5CD'} />
          <Text style={styles.uploadImageText}>Upload an Image</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
        <Text style={styles.modalTitleSmaller}>Time</Text>

        <XStack>
          {timeButton('15 mins')}
          {timeButton('30 mins')}
          {timeButton('1 hr')}
        </XStack>

        <XStack>
          {timeButton('2 hrs')}
          {timeButton('3 hrs')}
        </XStack>

        <View style={{ height: 20 }} />
        <Text style={styles.modalTitleSmaller}>Appliances</Text>
        <XStack>
          {applianceButton('Stove')}
          {applianceButton('Oven')}
          {applianceButton('Microwave')}
        </XStack>

        <XStack>
          {applianceButton('Air Fryer')}
          {applianceButton('Rice Cooker')}
        </XStack>

        <View style={{ height: 20 }} />
        <XStack style={styles.row}>
          <Text style={styles.modalTitleSmaller}>Diet</Text>
          <View style={{ width: 5 }} />
          <Text style={styles.modalText}>(be as specific as possible!)</Text>
        </XStack>

        <TextInput
          style={styles.input}
          placeholder="Vegeterian, vegan, keto, etc"
          value={diet}
          onChangeText={(text) => setDiet(text)}
        />

        <View style={{ height: 20 }} />
        <Text style={styles.modalTitleSmaller}>Complexity</Text>
        <XStack>
          {complexityButton('Easy')}
          {complexityButton('Medium')}
          {complexityButton('Hard')}
        </XStack>

        <View style={{ height: 20 }} />
        <Text style={styles.modalTitleSmaller}>Yield</Text>
        {/* <SelectDemo /> */}

        <View
          style={[styles.preferenceButton, { borderRadius: 15, width: 80 }]}
        >
          <Text
            style={[styles.modalText, { marginBottom: 0 }, { fontSize: 16 }]}
          >
            {servingsAmount}
          </Text>
          <View style={{ width: 10 }} />
          <YStack>
            <TouchableOpacity
              onPress={() => {
                if (servingsAmount < 9) {
                  setServingsAmount(servingsAmount + 1);
                }
              }}
            >
              <ChevronUp
                marginLeft={10}
                size={20}
                color={
                  servingsAmount < 9 ? '#FFF5CD' : 'rgba(255, 245, 205, 0.1)'
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (servingsAmount > 1) {
                  setServingsAmount(servingsAmount - 1);
                }
              }}
            >
              <ChevronDown
                marginLeft={10}
                size={20}
                color={
                  servingsAmount > 1 ? '#FFF5CD' : 'rgba(255, 245, 205, 0.1)'
                }
              />
            </TouchableOpacity>
          </YStack>
        </View>
        <View style={{ height: 20 }} />
        <Button
          style={styles.recipeGeneratorButton}
          onPress={() => generateRecipe()}
        >
          <Text style={[styles.modalTitleSmaller, { marginBottom: 0 }]}>
            Generate Recipe
          </Text>
        </Button>
        <View
          style={[styles.errorMessageContainer, { height: showError ? 40 : 0 }]}
        >
          <FontAwesome name="warning" size={20} color={'#FD9B62'} />
          <Text style={styles.errorMessageText}>
            Make sure to fill out all of the sections.
          </Text>
        </View>
      </View>
    );
  };

  const generatedRecipePage = () => {
    return (
      <View style={{ padding: 20 }}>
        <Text style={styles.modalTitle}>Tadaaa, now this what we want...</Text>
        <View style={{ height: 50 }} />
        <Text style={styles.modalTitle}>{generatedRecipeTitle}</Text>
        <Text style={styles.modalLargerText}>{generatedRecipeDescription}</Text>
        <View style={{ height: 30 }} />

        <XStack style={styles.container}>
          <YStack style={styles.centeredYStack}>
            <Text style={styles.modalTitleSmaller}>Servings</Text>
            <Text style={styles.modalLargerText}>{servingsAmount}</Text>
          </YStack>
          <YStack style={styles.centeredYStack}>
            <Text style={styles.modalTitleSmaller}>Time</Text>
            <Text style={styles.modalLargerText}>{selectedTime}</Text>
          </YStack>
          <YStack style={styles.centeredYStack}>
            <Text style={styles.modalTitleSmaller}>Complexity</Text>
            <Text style={styles.modalLargerText}>{complexityLevel}</Text>
          </YStack>
        </XStack>

        <View style={{ height: 30 }} />
        <Text style={styles.modalTitleSmaller}>Ingredients</Text>
        {generatedRecipeIngredients.map((ingredient, index) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.ingredientText}>{ingredient}</Text>
          </View>
        ))}
        <View style={{ height: 15 }} />
        <Text style={styles.modalTitleSmaller}>Directions</Text>
        {generatedRecipeDirections.map((direction, index) => (
          <View key={index} style={styles.orderedItem}>
            <Text style={styles.orderedNumber}>{index + 1}.</Text>
            <Text style={styles.directionText}>{direction}</Text>
          </View>
        ))}

        <View style={{ height: 20 }} />
        <Text style={styles.modalTitleSmaller}>Nutritional Facts</Text>

        <YStack gap={0}>
          <XStack>
            <Text style={styles.modalLargerText}>Calories per serving:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeCaloriesPerServing}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Total Fat:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeTotalFat}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Sodium:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeSodium}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Dietary Fiber:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeDietaryFiber}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Protein:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeProtein}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>VitaminC:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeVitaminC}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Potassium:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipePotassium}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Cholesterol:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeCholesterol}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Total Carbohydrate:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeTotalCarb}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Sugars:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeSugars}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Vitamin A:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeVitaminA}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Iron:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipeIron}
            </Text>
          </XStack>

          <XStack>
            <Text style={styles.modalLargerText}>Phosphorus:</Text>
            <View style={{ width: 5 }} />
            <Text style={[styles.modalLargerText, { fontFamily: 'Lato-Bold' }]}>
              {generatedRecipePhosphorus}
            </Text>
          </XStack>
        </YStack>

        <View style={{ height: 30 }} />

        <Button
          style={styles.recipeGeneratorButton}
          onPress={() => addToPlanner()}
        >
          <Text style={[styles.modalTitleSmaller, { marginBottom: 0 }]}>
            Add to planner
          </Text>
        </Button>

        {/* Bullet point */}
        {/* <Text>{'\u2022'}</Text> */}
      </View>
    );
  };

  const mealButton = (meal: string) => {
    let icon = null;

    if (meal === 'Breakfast') {
      icon = (
        <MaterialCommunityIcons name="egg-fried" size={40} color={'#FFF5CD'} />
      );
    } else if (meal === 'Lunch') {
      icon = <MaterialCommunityIcons name="food" size={35} color={'#FFF5CD'} />;
    } else if (meal === 'Dinner') {
      icon = <MaterialIcons name="dinner-dining" size={35} color={'#FFF5CD'} />;
    } else {
      icon = (
        <MaterialCommunityIcons
          name="food-apple-outline"
          size={35}
          color={'#FFF5CD'}
        />
      );
    }

    return (
      <Button style={styles.mealButton} onPress={() => setSelectedMeal(meal)}>
        {icon} {/* Render the determined icon */}
        <Text
          style={[
            styles.modalTitleSmaller,
            { marginBottom: 0 },
            { color: '#FFF5CD' },
          ]}
        >
          {meal}
        </Text>
      </Button>
    );
  };

  const goToPlanner = () => {
    navigation.navigate('Planner', { userId });
  };

  const goToCollection = () => {
    navigation.navigate('Collection', { userId });
  };

  const handleTimeSelected = (time: string) => {
    setSelectedTime(time);
  };

  const handleComplexitySelected = (complexity: string) => {
    setComplexityLevel(complexity);
  };

  const addToPlanner = () => {};

  const generateRecipe = async () => {
    if (
      !selectedTime ||
      applianceArray.length === 0 ||
      !complexityLevel ||
      !diet ||
      !ingredients
    ) {
      setShowError(true);
    } else {
      setShowError(false);
      console.log(selectedTime);
      console.log(applianceArray);
      console.log(complexityLevel);
      console.log(ingredients);
      console.log(diet);
      setGenerateRecipeBoolean(true);

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
      // Add logic to generate recipe here

      let applianceString = '';
      for (let i = 0; i < applianceArray.length; i++) {
        applianceString += applianceArray[i];
        if (i != applianceArray.length - 1) {
          applianceString += ', ';
        }
      }

      // setApplianceString(str);

      //FIX THIS!!!
      // setServingsAmount(selectedItem);

      let servingsAmountString = servingsAmount.toString();

      const inputText = makeInput(
        selectedTime,
        applianceString,
        diet,
        complexityLevel,
        servingsAmountString,
        ingredients,
      );

      // const openai = new OpenAI({
      //   apiKey: process.env.EXPO_PUBLIC_API_KEY_OPENAI, // Replace with your actual API key
      // });

      // const result = await openai.chat.completions.create({
      //   model: 'gpt-4o',
      //   messages: [{ role: 'user', content: inputText }],
      // });

      // const generatedText = result.choices[0]?.message.content ?? '';

      const generatedText =
        'Title: Creamy Potato Soup Description: A comforting and creamy potato soup made with simple ingredients, perfect for a quick and satisfying meal. Ingredients: 3 potatoes, 2 sticks of butter, 1 gal of milk Directions: Peel and dice the potatoes. In a large pot, melt the butter over medium heat. Add the diced potatoes and sauté for 2-3 minutes. Pour in the milk and bring to a gentle simmer. Cook for about 10 minutes or until the potatoes are tender. Use a potato masher or immersion blender to blend some of the potatoes to thicken the soup while leaving some chunks for texture. Season with salt and pepper to taste. Serve hot. Calories: Approximately 350 calories';

      organizeOutput(generatedText);

      console.log('SERVINGS ' + servingsAmountString);
    }
  };

  //convert appliance array to string

  const makeInput = (
    cookTime: string,
    appliance: string,
    diet: string,
    complexity: string,
    quantity: string,
    ingredients: string,
  ) => {
    const input = `Generate me a recipe with these constraints: ${cookTime} cooking time, cooked on ${appliance}, diet ${diet}, ${complexity}, ${quantity} yield. The ingredients available are ${ingredients}. I need the response to be generated in this way: Title: (title of dish) Description: (description of dish) Ingredients: (list of all ingredients separated by a comma) Directions: (list of cooking directions separated by a period) Calories: (calorie amount)`;
    return input;
  };

  const organizeOutput = (output: string) => {
    const wordsToSplitBy = [
      'Title: ',
      'Description: ',
      'Ingredients: ',
      'Directions: ',
      'Calories: ',
    ];
    const pattern = wordsToSplitBy.join('|');
    const infoArray = output.split(new RegExp(pattern, 'i'));

    if (infoArray[1]) {
      setGeneratedRecipeTitle(infoArray[1]);
    }

    if (infoArray[2]) {
      setGeneratedRecipeDescription(infoArray[2]);
    }

    if (infoArray[3]) {
      setGeneratedRecipeIngredients(infoArray[3].split(', '));
    }

    if (infoArray[4]) {
      let curDirs = infoArray[4];
      if (curDirs[curDirs.length - 2] === '.') {
        curDirs = curDirs.slice(0, curDirs.length - 2);
      }
      setGeneratedRecipeDirections(curDirs.split('. '));
    }

    if (infoArray[5]) {
      const regex = /\d+/g;
      const numbers = infoArray[5].match(regex);
      if (numbers && numbers[0]) {
        setGeneratedRecipeCaloriesPerServing(numbers[0] + 'g');
      }
    }

    //TODO: add other nutrition facts!
  };

  const timeButton = (str: string) => {
    return (
      <Button
        style={[
          styles.preferenceButton,
          selectedTime === str ? styles.selectedPreferenceButton : {},
        ]}
        onPress={() => handleTimeSelected(str)}
      >
        <Ionicons name="alarm-outline" size={20} color={'#FFF5CD'} />
        <Text style={{ marginLeft: 5, color: '#FFF5CD' }}>{str}</Text>
      </Button>
    );
  };

  const handleAppliancesSelected = (appliance: string) => {
    if (applianceArray.includes(appliance)) {
      const updatedArray = applianceArray.filter((item) => item !== appliance);
      setApplianceArray(updatedArray);
    } else {
      const updatedApplianceArray = [...applianceArray, appliance];
      setApplianceArray(updatedApplianceArray);
    }
  };

  const applianceButton = (appliance: string) => {
    const isSelected = applianceArray.includes(appliance);

    return (
      <Button
        style={[
          styles.preferenceButton,
          isSelected ? styles.selectedPreferenceButton : {},
        ]}
        onPress={() => handleAppliancesSelected(appliance)}
      >
        <Ionicons name="construct-outline" size={20} color={'#FFF5CD'} />
        <Text style={{ marginLeft: 5, color: '#FFF5CD' }}>{appliance}</Text>
      </Button>
    );
  };

  const complexityButton = (complexity: string) => {
    return (
      <Button
        style={[
          styles.preferenceButton,
          complexityLevel === complexity ? styles.selectedPreferenceButton : {},
        ]}
        onPress={() => handleComplexitySelected(complexity)}
      >
        <Ionicons name="star" size={20} color={'#FFF5CD'} />
        <Text style={{ marginLeft: 5, color: '#FFF5CD' }}>{complexity}</Text>
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={{ padding: 40 }}>
          <View style={{ height: 50 }} />

          {/* {generatedRecipePage()} */}

          {!selectedMeal && !generateRecipeBoolean && (
            <>
              <View style={{ height: 150 }} />
              <Text style={[styles.modalTitle, { textAlign: 'center' }]}>
                What are we tryna chef up today?
              </Text>
              <View style={{ height: 50 }} />
              <YStack>
                {mealButton('Breakfast')}
                {mealButton('Lunch')}
                {mealButton('Dinner')}
                {mealButton('Snack')}
              </YStack>
            </>
          )}

          {selectedMeal && !generateRecipeBoolean && (
            <>{userPreferencePage()}</>
          )}

          {generateRecipeBoolean && <>{generatedRecipePage()}</>}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.buttons}>
        <Button style={styles.button} onPress={goToPlanner}>
          <Ionicons name="calendar-outline" size={40} color={'#FFF5CD'} />
        </Button>
        <Button style={styles.button}>
          <Ionicons name="create" size={40} color={'#FFF5CD'} />
        </Button>
        <Button style={styles.button} onPress={goToCollection}>
          <Ionicons name="basket-outline" size={40} color={'#FFF5CD'} />
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#365E32',
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  buttons: {
    backgroundColor: '#82A263',
    flexDirection: 'row',
    height: 100,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Arvo-Bold',
    marginBottom: 10,
    color: '#E7D37F',
  },
  modalTitleSmaller: {
    fontSize: 18,
    fontFamily: 'Arvo-Bold',
    marginBottom: 10,
    color: '#E7D37F',
  },
  modalText: {
    fontSize: 12,
    fontFamily: 'Lato',
    marginBottom: 10,
    color: '#FFF5CD',
  },
  modalLargerText: {
    fontSize: 14,
    fontFamily: 'Lato-SemiBold',
    marginBottom: 10,
    color: '#FFF5CD',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF5CD',
    padding: 10,
    marginBottom: 5,
    borderRadius: 9,
  },
  uploadImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 0,
    marginBottom: 5,
  },
  uploadImageText: {
    marginLeft: 5,
    color: '#FFF5CD',
  },
  selectedPreferenceButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: '#AFA26B',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FFF5CD',
    borderWidth: 2,
    borderRadius: 20,
  },
  preferenceButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#FFF5CD',
    borderWidth: 2,
    borderRadius: 20,
  },
  recipeGeneratorButton: {
    backgroundColor: '#FD9B62',
    paddingHorizontal: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorMessageText: {
    marginLeft: 5,
    fontSize: 16,
    fontFamily: 'Lato-bold',
    color: '#FD9B62',
    textAlign: 'center',
  },
  mealButton: {
    backgroundColor: '#FD9B62',
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredYStack: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: -7,
  },
  bulletPoint: {
    fontSize: 35,
    marginRight: 10,
    marginLeft: 10,
    color: '#FFF5CD',
    marginTop: -5,
  },
  ingredientText: {
    fontSize: 16,
    color: '#FFF5CD',
    fontWeight: '500',
    marginLeft: -10,
  },
  orderedItem: {
    flexDirection: 'row',
    marginRight: 45,
    marginBottom: 5,
  },
  orderedNumber: {
    fontSize: 18,
    marginRight: 15,
    marginLeft: 10,
    color: '#FFF5CD',
  },
  directionText: {
    fontSize: 16,
    color: '#FFF5CD',
    fontWeight: '500',
    marginTop: 2,
    marginLeft: -10,
  },
});

export default RecipeGenerator;
