import { Button as ButtonNativeBase, IButtonProps, Heading } from 'native-base';

type Props = IButtonProps & {
    title: string;

}

export function Button({ title, ...rest }: Props) {
  return (
    <ButtonNativeBase bg="#ecfdf5" fontSize="sm" rounded="sm"  {...rest}>
        <Heading fontSize="lg">{title}</Heading>
    </ButtonNativeBase>
  );
}