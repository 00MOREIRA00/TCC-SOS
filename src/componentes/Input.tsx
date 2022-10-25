import { Input as NativeBaseInput, IInputProps } from 'native-base';

export function Input({...rest}: IInputProps) {
  return (
    <NativeBaseInput 
      bg="#ecfdf5" 
      h={14} 
      size="md" 
      borderWidth={1} 
      fontSize="md" 
      fontFamily="body" 
      color="black" 
      placeholderTextColor="black" 
      {...rest}
    />
  );
}