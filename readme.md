#Lago dos Pirilampos

##Elemento Generativo escolhido
Os pirilampos : 140 pontos de luz que voam sozinhos sobre o lago e piscam cada um ao seu ritmo. O céu, a lua e as colinas ficam paradas e servem de base. A relva, as flores e as estrelas cadentes também se mexem, mas são o cenário e não o elemento principal.

##Funcionamento
A cada imagem, um contador de tempo (t) avança um bocadinho. Esse valor passa por noise(), devolvendo números que mudam de forma suave, e é somado à posição de cada pirilampo: cerca de 1px na horizontal e 0.8 na vertical por imagem. Cada pirilampo começa num ponto diferente do ruído, por isso nenhum voa como outro.

O piscar usa sin() elevado à sexta potência(pow), que deixa só um clarão curto e quase escuridão no resto do tempo. Cada pirilampo tem também um valor de profundidade (z, entre 0.3 e 1 ) que define o tamanho e o brilho: os que estão mais longe são mais pequenos e mais fracos. A cor muda com lerp(), aproximando a cor atual da nova pouco a pouco.

##Motivo
Pirilampos: a sua escolha deveu-se ao facto de uma pequena luz e frágil no escuro, e o seu piscar darem ritmo à imagem sem precisar de mais nada.
Lago: o lago pois o seu reflexo criaria profundidade
Acabei por utilizar o noise() e não random(), pois o random() dá saltos bruscos, o que dava a entender um "tremor" - esta informação o cunhado do meu namorado ajudou me a entender-  já o noise() permitiu um voo orgânico , quase como um respirar.
O facto de ter escolhido também um piscar mais lento e suave  era para evitar que parecessem lâmpadas a piscar.
Decidi fazer isto, pois imaginei um mundo calmo e mágico , um mundo onde qualquer criança gostaria de ficar, o meu mundo que eu imaginava quando era criança.

##Efeito na composição
Tudo o que é fixo fica calmo, e é isso que faz as luzes dos pirilampos destacarem-se. A profundidade nasce de três coisas: pirilampso de diversos tamanhos, o fundo que se move ligeiramente com o rato e o reflexo do lago.

##Como interagir
Rato: a luz segue o cursor e atrai os pirilampos
clique no lago: ondas e novos pirilampos
clique e araste na relva: nascem flores
clique no céu: cadentes
setas: vento 


Ajudas
cunhado do meu namorado | engenheiro informático
