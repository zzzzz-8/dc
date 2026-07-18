import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const wordbooks = [
  {
    name: '牛津上海版六年级上册（新课标版）',
    grade: '六年级上册',
    publisher: '牛津上海版',
    level: 'JUNIOR',
    totalWords: 115,
    words: [
      { word: 'apple', meaning: '苹果', phonetic: 'ˈæpl', partOfSpeech: 'n.', example: 'I eat an apple every day.', exampleTrans: '我每天吃一个苹果。' },
      { word: 'book', meaning: '书；书本', phonetic: 'bʊk', partOfSpeech: 'n.', example: 'This is my English book.', exampleTrans: '这是我的英语书。' },
      { word: 'cat', meaning: '猫', phonetic: 'kæt', partOfSpeech: 'n.', example: 'The cat is sleeping.', exampleTrans: '猫正在睡觉。' },
      { word: 'dog', meaning: '狗', phonetic: 'dɒɡ', partOfSpeech: 'n.', example: 'I have a pet dog.', exampleTrans: '我有一只宠物狗。' },
      { word: 'elephant', meaning: '大象', phonetic: 'ˈelɪfənt', partOfSpeech: 'n.', example: 'An elephant never forgets.', exampleTrans: '大象从不遗忘。' },
      { word: 'flower', meaning: '花；花朵', phonetic: 'ˈflaʊə', partOfSpeech: 'n.', example: 'The flowers bloom in spring.', exampleTrans: '花在春天绽放。' },
      { word: 'garden', meaning: '花园', phonetic: 'ˈɡɑːdn', partOfSpeech: 'n.', example: 'We play in the garden.', exampleTrans: '我们在花园里玩。' },
      { word: 'house', meaning: '房子；房屋', phonetic: 'haʊs', partOfSpeech: 'n.', example: 'My house is near the school.', exampleTrans: '我的房子在学校附近。' },
      { word: 'island', meaning: '岛；岛屿', phonetic: 'ˈaɪlənd', partOfSpeech: 'n.', example: 'They live on a small island.', exampleTrans: '他们住在一个小岛上。' },
      { word: 'juice', meaning: '果汁', phonetic: 'dʒuːs', partOfSpeech: 'n.', example: 'Orange juice is my favorite.', exampleTrans: '橙汁是我的最爱。' },
      { word: 'kite', meaning: '风筝', phonetic: 'kaɪt', partOfSpeech: 'n.', example: 'The kite flies high in the sky.', exampleTrans: '风筝在天空中高高飞翔。' },
      { word: 'lion', meaning: '狮子', phonetic: 'ˈlaɪən', partOfSpeech: 'n.', example: 'The lion is the king of animals.', exampleTrans: '狮子是百兽之王。' },
      { word: 'monkey', meaning: '猴子', phonetic: 'ˈmʌŋki', partOfSpeech: 'n.', example: 'Monkeys like bananas.', exampleTrans: '猴子喜欢香蕉。' },
      { word: 'night', meaning: '夜晚', phonetic: 'naɪt', partOfSpeech: 'n.', example: 'Good night!', exampleTrans: '晚安！' },
      { word: 'ocean', meaning: '海洋', phonetic: 'ˈəʊʃn', partOfSpeech: 'n.', example: 'The ocean is very deep.', exampleTrans: '海洋很深。' },
      { word: 'pencil', meaning: '铅笔', phonetic: 'ˈpensl', partOfSpeech: 'n.', example: 'Please use a pencil to write.', exampleTrans: '请用铅笔写。' },
      { word: 'queen', meaning: '女王；王后', phonetic: 'kwiːn', partOfSpeech: 'n.', example: 'The queen lives in the palace.', exampleTrans: '女王住在宫殿里。' },
      { word: 'river', meaning: '河流', phonetic: 'ˈrɪvə', partOfSpeech: 'n.', example: 'The river flows to the sea.', exampleTrans: '河流流向大海。' },
      { word: 'school', meaning: '学校', phonetic: 'skuːl', partOfSpeech: 'n.', example: 'I go to school by bus.', exampleTrans: '我坐公交车去学校。' },
      { word: 'tiger', meaning: '老虎', phonetic: 'ˈtaɪɡə', partOfSpeech: 'n.', example: 'The tiger is very strong.', exampleTrans: '老虎非常强壮。' },
      { word: 'umbrella', meaning: '雨伞', phonetic: 'ʌmˈbrelə', partOfSpeech: 'n.', example: 'Take an umbrella, it may rain.', exampleTrans: '带把伞，可能会下雨。' },
      { word: 'violin', meaning: '小提琴', phonetic: 'ˌvaɪəˈlɪn', partOfSpeech: 'n.', example: 'She plays the violin well.', exampleTrans: '她小提琴拉得很好。' },
      { word: 'water', meaning: '水', phonetic: 'ˈwɔːtə', partOfSpeech: 'n.', example: 'I drink water every day.', exampleTrans: '我每天都喝水。' },
      { word: 'fox', meaning: '狐狸', phonetic: 'fɒks', partOfSpeech: 'n.', example: 'The fox is very clever.', exampleTrans: '狐狸很聪明。' },
      { word: 'yellow', meaning: '黄色的', phonetic: 'ˈjeləʊ', partOfSpeech: 'adj.', example: 'The sun is yellow.', exampleTrans: '太阳是黄色的。' },
      { word: 'zoo', meaning: '动物园', phonetic: 'zuː', partOfSpeech: 'n.', example: 'We went to the zoo yesterday.', exampleTrans: '我们昨天去了动物园。' },
      { word: 'happy', meaning: '快乐的；高兴的', phonetic: 'ˈhæpi', partOfSpeech: 'adj.', example: 'I am very happy today.', exampleTrans: '我今天非常高兴。' },
      { word: 'beautiful', meaning: '美丽的；漂亮的', phonetic: 'ˈbjuːtɪfl', partOfSpeech: 'adj.', example: 'The flowers are beautiful.', exampleTrans: '这些花很美丽。' },
      { word: 'quickly', meaning: '快速地', phonetic: 'ˈkwɪkli', partOfSpeech: 'adv.', example: 'She runs quickly.', exampleTrans: '她跑得很快。' },
      { word: 'always', meaning: '总是；一直', phonetic: 'ˈɔːlweɪz', partOfSpeech: 'adv.', example: 'He always gets up early.', exampleTrans: '他总是早起。' },
    ],
  },
  {
    name: '人教PEP版三年级上册',
    grade: '三年级上册',
    publisher: '人教PEP版',
    level: 'PRIMARY',
    totalWords: 60,
    words: [
      { word: 'ruler', meaning: '尺子', phonetic: 'ˈruːlə', partOfSpeech: 'n.', example: 'I have a new ruler.', exampleTrans: '我有一把新尺子。' },
      { word: 'eraser', meaning: '橡皮', phonetic: 'ɪˈreɪzə', partOfSpeech: 'n.', example: 'May I use your eraser?', exampleTrans: '我可以用一下你的橡皮吗？' },
      { word: 'crayon', meaning: '蜡笔', phonetic: 'ˈkreɪɒn', partOfSpeech: 'n.', example: 'I draw with crayons.', exampleTrans: '我用蜡笔画画。' },
      { word: 'bag', meaning: '包；书包', phonetic: 'bæɡ', partOfSpeech: 'n.', example: 'My bag is heavy.', exampleTrans: '我的书包很重。' },
      { word: 'pen', meaning: '钢笔', phonetic: 'pen', partOfSpeech: 'n.', example: 'This is a blue pen.', exampleTrans: '这是一支蓝色的钢笔。' },
      { word: 'pencil box', meaning: '铅笔盒', phonetic: 'ˈpensl bɒks', partOfSpeech: 'n.', example: 'My pencil box is red.', exampleTrans: '我的铅笔盒是红色的。' },
      { word: 'book', meaning: '书', phonetic: 'bʊk', partOfSpeech: 'n.', example: 'Open your book.', exampleTrans: '打开你的书。' },
      { word: 'monster', meaning: '怪物', phonetic: 'ˈmɒnstə', partOfSpeech: 'n.', example: 'There is a monster under my bed!', exampleTrans: '我床底下有个怪物！' },
      { word: 'mum', meaning: '妈妈', phonetic: 'mʌm', partOfSpeech: 'n.', example: 'Goodbye, Mum!', exampleTrans: '再见，妈妈！' },
      { word: 'dad', meaning: '爸爸', phonetic: 'dæd', partOfSpeech: 'n.', example: 'Dad is reading a book.', exampleTrans: '爸爸正在看书。' },
      { word: 'brother', meaning: '兄弟', phonetic: 'ˈbrʌðə', partOfSpeech: 'n.', example: 'I have a little brother.', exampleTrans: '我有一个小弟弟。' },
      { word: 'sister', meaning: '姐妹', phonetic: 'ˈsɪstə', partOfSpeech: 'n.', example: 'My sister is tall.', exampleTrans: '我姐姐很高。' },
      { word: 'teacher', meaning: '老师', phonetic: 'ˈtiːtʃə', partOfSpeech: 'n.', example: 'My teacher is kind.', exampleTrans: '我的老师很和蔼。' },
      { word: 'student', meaning: '学生', phonetic: 'ˈstjuːdnt', partOfSpeech: 'n.', example: 'I am a student.', exampleTrans: '我是一名学生。' },
      { word: 'head', meaning: '头', phonetic: 'hed', partOfSpeech: 'n.', example: 'Touch your head.', exampleTrans: '摸摸你的头。' },
      { word: 'face', meaning: '脸', phonetic: 'feɪs', partOfSpeech: 'n.', example: 'She has a round face.', exampleTrans: '她有一张圆脸。' },
      { word: 'nose', meaning: '鼻子', phonetic: 'nəʊz', partOfSpeech: 'n.', example: 'The clown has a red nose.', exampleTrans: '小丑有一个红鼻子。' },
      { word: 'mouth', meaning: '嘴', phonetic: 'maʊθ', partOfSpeech: 'n.', example: 'Open your mouth.', exampleTrans: '张开你的嘴。' },
      { word: 'arm', meaning: '手臂', phonetic: 'ɑːm', partOfSpeech: 'n.', example: 'Raise your arm.', exampleTrans: '举起你的手臂。' },
      { word: 'hand', meaning: '手', phonetic: 'hænd', partOfSpeech: 'n.', example: 'Wash your hands.', exampleTrans: '洗洗你的手。' },
      { word: 'eye', meaning: '眼睛', phonetic: 'aɪ', partOfSpeech: 'n.', example: 'She has big eyes.', exampleTrans: '她有大眼睛。' },
      { word: 'ear', meaning: '耳朵', phonetic: 'ɪə', partOfSpeech: 'n.', example: 'The rabbit has long ears.', exampleTrans: '兔子有长耳朵。' },
      { word: 'leg', meaning: '腿', phonetic: 'leɡ', partOfSpeech: 'n.', example: 'My legs are long.', exampleTrans: '我的腿很长。' },
      { word: 'foot', meaning: '脚', phonetic: 'fʊt', partOfSpeech: 'n.', example: 'I hurt my foot.', exampleTrans: '我伤了脚。' },
      { word: 'body', meaning: '身体', phonetic: 'ˈbɒdi', partOfSpeech: 'n.', example: 'We use our body to exercise.', exampleTrans: '我们用身体锻炼。' },
      { word: 'bird', meaning: '鸟', phonetic: 'bɜːd', partOfSpeech: 'n.', example: 'A bird can fly.', exampleTrans: '鸟会飞。' },
      { word: 'panda', meaning: '熊猫', phonetic: 'ˈpændə', partOfSpeech: 'n.', example: 'Pandas live in China.', exampleTrans: '熊猫生活在中国。' },
      { word: 'bear', meaning: '熊', phonetic: 'beə', partOfSpeech: 'n.', example: 'The bear is big.', exampleTrans: '熊很大。' },
      { word: 'duck', meaning: '鸭子', phonetic: 'dʌk', partOfSpeech: 'n.', example: 'The duck is swimming.', exampleTrans: '鸭子正在游泳。' },
      { word: 'pig', meaning: '猪', phonetic: 'pɪɡ', partOfSpeech: 'n.', example: 'The pig is pink.', exampleTrans: '猪是粉色的。' },
    ],
  },
  {
    name: '大学英语四级核心词汇',
    grade: '四级',
    publisher: 'CET4',
    level: 'UNIVERSITY',
    totalWords: 200,
    words: [
      { word: 'abandon', meaning: '放弃；遗弃', phonetic: 'əˈbændən', partOfSpeech: 'v.', example: "Don't abandon your dreams.", exampleTrans: '不要放弃你的梦想。', difficulty: 3 },
      { word: 'ability', meaning: '能力；才能', phonetic: 'əˈbɪləti', partOfSpeech: 'n.', example: 'He has great ability.', exampleTrans: '他很有能力。', difficulty: 3 },
      { word: 'absence', meaning: '缺席；不在', phonetic: 'ˈæbsəns', partOfSpeech: 'n.', example: 'She was sad about his absence.', exampleTrans: '她对他的缺席感到难过。', difficulty: 3 },
      { word: 'absolute', meaning: '绝对的；完全的', phonetic: 'ˈæbsəluːt', partOfSpeech: 'adj.', example: 'I have absolute trust in you.', exampleTrans: '我绝对信任你。', difficulty: 3 },
      { word: 'academic', meaning: '学术的', phonetic: 'ˌækəˈdemɪk', partOfSpeech: 'adj.', example: 'She has a great academic record.', exampleTrans: '她有很好的学术记录。', difficulty: 4 },
      { word: 'accelerate', meaning: '加速；促进', phonetic: 'əkˈseləreɪt', partOfSpeech: 'v.', example: 'The car accelerated quickly.', exampleTrans: '汽车快速加速。', difficulty: 4 },
      { word: 'access', meaning: '通道；接近；进入', phonetic: 'ˈækses', partOfSpeech: 'n./v.', example: 'Do you have access to the library?', exampleTrans: '你能进入图书馆吗？', difficulty: 3 },
      { word: 'accompany', meaning: '陪伴；伴随', phonetic: 'əˈkʌmpəni', partOfSpeech: 'v.', example: 'I will accompany you home.', exampleTrans: '我会陪你回家。', difficulty: 4 },
      { word: 'accomplish', meaning: '完成；实现', phonetic: 'əˈkʌmplɪʃ', partOfSpeech: 'v.', example: 'He accomplished his goal.', exampleTrans: '他实现了目标。', difficulty: 4 },
      { word: 'accurate', meaning: '准确的；精确的', phonetic: 'ˈækjərət', partOfSpeech: 'adj.', example: 'The data is accurate.', exampleTrans: '数据是准确的。', difficulty: 3 },
      { word: 'achieve', meaning: '达到；取得', phonetic: 'əˈtʃiːv', partOfSpeech: 'v.', example: 'She achieved great success.', exampleTrans: '她取得了巨大的成功。', difficulty: 2 },
      { word: 'acknowledge', meaning: '承认；确认', phonetic: 'əkˈnɒlɪdʒ', partOfSpeech: 'v.', example: 'I acknowledge my mistake.', exampleTrans: '我承认我的错误。', difficulty: 4 },
      { word: 'acquire', meaning: '获得；学到', phonetic: 'əˈkwaɪə', partOfSpeech: 'v.', example: 'She acquired many skills.', exampleTrans: '她学到了很多技能。', difficulty: 3 },
      { word: 'adapt', meaning: '适应；改编', phonetic: 'əˈdæpt', partOfSpeech: 'v.', example: 'You must adapt to changes.', exampleTrans: '你必须适应变化。', difficulty: 3 },
      { word: 'adequate', meaning: '足够的；充分的', phonetic: 'ˈædɪkwət', partOfSpeech: 'adj.', example: 'We have adequate time.', exampleTrans: '我们有足够的时间。', difficulty: 4 },
      { word: 'adjust', meaning: '调整；适应', phonetic: 'əˈdʒʌst', partOfSpeech: 'v.', example: 'Adjust the volume, please.', exampleTrans: '请调整音量。', difficulty: 3 },
      { word: 'administration', meaning: '管理；行政', phonetic: 'ədˌmɪnɪˈstreɪʃn', partOfSpeech: 'n.', example: 'She works in administration.', exampleTrans: '她在行政部门工作。', difficulty: 4, examLevel: 'CET4' },
      { word: 'adopt', meaning: '采用；收养', phonetic: 'əˈdɒpt', partOfSpeech: 'v.', example: 'They decided to adopt a child.', exampleTrans: '他们决定收养一个孩子。', difficulty: 3 },
      { word: 'advance', meaning: '前进；进步', phonetic: 'ədˈvɑːns', partOfSpeech: 'v./n.', example: 'Technology continues to advance.', exampleTrans: '技术不断进步。', difficulty: 2 },
      { word: 'advantage', meaning: '优势；有利条件', phonetic: 'ədˈvɑːntɪdʒ', partOfSpeech: 'n.', example: 'Being tall is an advantage.', exampleTrans: '高个子是一个优势。', difficulty: 3 },
      { word: 'advertise', meaning: '做广告；宣传', phonetic: 'ˈædvətaɪz', partOfSpeech: 'v.', example: 'Companies advertise on TV.', exampleTrans: '公司在电视上做广告。', difficulty: 3 },
      { word: 'affair', meaning: '事务；事件', phonetic: 'əˈfeə', partOfSpeech: 'n.', example: 'It is a private affair.', exampleTrans: '这是私事。', difficulty: 3 },
      { word: 'affect', meaning: '影响；感动', phonetic: 'əˈfekt', partOfSpeech: 'v.', example: 'The rain affected the game.', exampleTrans: '下雨影响了比赛。', difficulty: 2 },
      { word: 'afford', meaning: '负担得起', phonetic: 'əˈfɔːd', partOfSpeech: 'v.', example: 'I can afford this car.', exampleTrans: '我买得起这辆车。', difficulty: 2 },
      { word: 'aggressive', meaning: '侵略的；好斗的', phonetic: 'əˈɡresɪv', partOfSpeech: 'adj.', example: 'He is very aggressive.', exampleTrans: '他很有攻击性。', difficulty: 4 },
      { word: 'agree', meaning: '同意；赞成', phonetic: 'əˈɡriː', partOfSpeech: 'v.', example: 'I agree with you.', exampleTrans: '我同意你的看法。', difficulty: 1 },
      { word: 'agriculture', meaning: '农业', phonetic: 'ˈæɡrɪkʌltʃə', partOfSpeech: 'n.', example: 'Agriculture is important.', exampleTrans: '农业很重要。', difficulty: 4 },
      { word: 'allocate', meaning: '分配；拨出', phonetic: 'ˈæləkeɪt', partOfSpeech: 'v.', example: 'Funds were allocated for education.', exampleTrans: '资金被分配给教育。', difficulty: 5 },
      { word: 'alternative', meaning: '替代的；供选择的', phonetic: 'ɔːlˈtɜːnətɪv', partOfSpeech: 'adj./n.', example: 'We need an alternative plan.', exampleTrans: '我们需要一个替代计划。', difficulty: 4 },
      { word: 'amaze', meaning: '使惊奇；使惊愕', phonetic: 'əˈmeɪz', partOfSpeech: 'v.', example: 'You amaze me!', exampleTrans: '你让我惊讶！', difficulty: 3 },
      { word: 'ambition', meaning: '雄心；野心', phonetic: 'æmˈbɪʃn', partOfSpeech: 'n.', example: 'She has great ambition.', exampleTrans: '她有很大的雄心。', difficulty: 3 },
      { word: 'analyze/analyse', meaning: '分析；解析', phonetic: 'ˈænəlaɪz', partOfSpeech: 'v.', example: 'We need to analyze the data.', exampleTrans: '我们需要分析数据。', difficulty: 4 },
      { word: 'announce', meaning: '宣布；通告', phonetic: 'əˈnaʊns', partOfSpeech: 'v.', example: 'They announced the winner.', exampleTrans: '他们宣布了获胜者。', difficulty: 3 },
      { word: 'annual', meaning: '每年的；年度的', phonetic: 'ˈænjuəl', partOfSpeech: 'adj.', example: 'We have an annual meeting.', exampleTrans: '我们有年会。', difficulty: 3 },
      { word: 'anxiety', meaning: '焦虑；忧虑', phonetic: 'æŋˈzaɪəti', partOfSpeech: 'n.', example: 'She felt great anxiety.', exampleTrans: '她感到非常焦虑。', difficulty: 4 },
      { word: 'apparent', meaning: '明显的；表面上的', phonetic: 'əˈpærənt', partOfSpeech: 'adj.', example: 'It is apparent that he is wrong.', exampleTrans: '很明显他错了。', difficulty: 4 },
      { word: 'appeal', meaning: '呼吁；吸引；上诉', phonetic: 'əˈpiːl', partOfSpeech: 'v./n.', example: 'The idea appeals to me.', exampleTrans: '这个主意吸引了我。', difficulty: 3 },
      { word: 'appetite', meaning: '食欲；胃口；欲望', phonetic: 'ˈæpɪtaɪt', partOfSpeech: 'n.', example: 'I have a good appetite.', exampleTrans: '我胃口很好。', difficulty: 4 },
      { word: 'appliance', meaning: '器具；家用电器', phonetic: 'əˈplaɪəns', partOfSpeech: 'n.', example: 'Kitchen appliances are expensive.', exampleTrans: '厨房电器很贵。', difficulty: 5 },
      { word: 'application', meaning: '申请；应用程序；应用', phonetic: 'ˌæplɪˈkeɪʃn', partOfSpeech: 'n.', example: 'I submitted my application.', exampleTrans: '我提交了申请。', difficulty: 3 },
      { word: 'appointment', meaning: '约会；预约；任命', phonetic: 'əˈpɔɪntmənt', partOfSpeech: 'n.', example: 'I have a doctor appointment.', exampleTrans: '我有一个医生预约。', difficulty: 3 },
      { word: 'appreciate', meaning: '感激；欣赏；理解', phonetic: 'əˈpriːʃieɪt', partOfSpeech: 'v.', example: 'I appreciate your help.', exampleTrans: '我感谢你的帮助。', difficulty: 3 },
      { word: 'approach', meaning: '接近；方法；途径', phonetic: 'əˈprəʊtʃ', partOfSpeech: 'v./n.', example: 'We need a new approach.', exampleTrans: '我们需要一种新方法。', difficulty: 3 },
      { word: 'appropriate', meaning: '适当的；合适的', phonetic: 'əˈprəʊpriət', partOfSpeech: 'adj.', example: 'Is this appropriate?', exampleTrans: '这合适吗？', difficulty: 4 },
      { word: 'approve', meaning: '批准；赞成', phonetic: 'əˈpruːv', partOfSpeech: 'v.', example: 'The plan was approved.', exampleTrans: '计划被批准了。', difficulty: 3 },
      { word: 'arrange', meaning: '安排；整理', phonetic: 'əˈreɪndʒ', partOfSpeech: 'v.', example: 'Please arrange a meeting.', exampleTrans: '请安排一次会议。', difficulty: 3 },
      { word: 'artificial', meaning: '人造的；虚假的', phonetic: 'ˌɑːtɪˈfɪʃl', partOfSpeech: 'adj.', example: 'This is artificial flowers.', exampleTrans: '这是人造花。', difficulty: 4 },
      { word: 'aspect', meaning: '方面；层面', phonetic: 'ˈæspekt', partOfSpeech: 'n.', example: 'Every aspect of life matters.', exampleTrans: '生活的每个方面都很重要。', difficulty: 3 },
      { word: 'assess', meaning: '评估；评价', phonetic: 'əˈses', partOfSpeech: 'v.', example: 'We need to assess the situation.', exampleTrans: '我们需要评估形势。', difficulty: 4 },
      { word: 'assign', meaning: '分配；指定', phonetic: 'əˈsaɪn', partOfSpeech: 'v.', example: 'The teacher assigned homework.', exampleTrans: '老师布置了作业。', difficulty: 3 },
      { word: 'associate', meaning: '联系；关联；伙伴', phonetic: 'əˈsəʊʃieɪt', partOfSpeech: 'v./n.', example: 'I associate summer with beach.', exampleTrans: '我把夏天和海滨联系在一起。', difficulty: 3 },
      { word: 'assume', meaning: '假定；承担', phonetic: 'əˈsjuːm', partOfSpeech: 'v.', example: 'I assume you are right.', exampleTrans: '我假定你是对的。', difficulty: 3 },
      { word: 'atmosphere', meaning: '气氛；大气层', phonetic: 'ˈætməsfɪə', partOfSpeech: 'n.', example: 'The atmosphere is tense.', exampleTrans: '气氛很紧张。', difficulty: 4 },
      { word: 'attach', meaning: '附上；连接；使依恋', phonetic: 'əˈtætʃ', partOfSpeech: 'v.', example: 'Please attach the file.', exampleTrans: '请附上文件。', difficulty: 3 },
      { word: 'attempt', meaning: '尝试；企图', phonetic: 'əˈtempt', partOfSpeech: 'v./n.', example: 'I will attempt to finish it.', exampleTrans: '我会尝试完成它。', difficulty: 2 },
      { word: 'attend', meaning: '参加；出席；照顾', phonetic: 'əˈtend', partOfSpeech: 'v.', example: 'Please attend the meeting.', exampleTrans: '请参加会议。', difficulty: 2 },
      { word: 'attitude', meaning: '态度；看法', phonetic: 'ˈætɪtjuːd', partOfSpeech: 'n.', example: 'She has a positive attitude.', exampleTrans: '她有积极的态度。', difficulty: 3 },
      { word: 'attract', meaning: '吸引；引起', phonetic: 'əˈtrækt', partOfSpeech: 'v.', example: 'The show attracts many people.', exampleTrans: '表演吸引了许多人。', difficulty: 3 },
      { word: 'authority', meaning: '权威；当局；权力', phonetic: 'ɔːˈθɒrəti', partOfSpeech: 'n.', example: 'You have no authority here.', exampleTrans: '你在这里没有权威。', difficulty: 4 },
      { word: 'available', meaning: '可用的；有效的', phonetic: 'əˈveɪləbl', partOfSpeech: 'adj.', example: 'Is this seat available?', exampleTrans: '这个座位有人吗？', difficulty: 3 },
      { word: 'balance', meaning: '平衡；余额', phonetic: 'ˈbæləns', partOfSpeech: 'n./v.', example: 'Keep your balance.', exampleTrans: '保持平衡。', difficulty: 3 },
      { word: 'bargain', meaning: '讨价还价；便宜货', phonetic: 'ˈbɑːɡɪn', partOfSpeech: 'v./n.', example: 'This is a real bargain!', exampleTrans: '这真是个便宜货！', difficulty: 3 },
      { word: 'barrier', meaning: '障碍；屏障', phonetic: 'ˈbæriə', partOfSpeech: 'n.', example: 'Language is a barrier.', exampleTrans: '语言是一个障碍。', difficulty: 4 },
      { word: 'behave', meaning: '行为；表现；举止', phonetic: 'bɪˈheɪv', partOfSpeech: 'v.', example: 'Please behave yourself.', exampleTrans: '请规矩点。', difficulty: 3 },
      { word: 'belief', meaning: '信念；信仰；相信', phonetic: 'bɪˈliːf', partOfSpeech: 'n.', example: 'My belief is strong.', exampleTrans: '我的信念很坚定。', difficulty: 3 },
      { word: 'benefit', meaning: '利益；好处；受益', phonetic: 'ˈbenɪfɪt', partOfSpeech: 'n./v.', example: 'Exercise benefits your health.', exampleTrans: '锻炼有益健康。', difficulty: 2 },
      { word: 'betray', meaning: '背叛；出卖', phonetic: 'bɪˈtreɪ', partOfSpeech: 'v.', example: "Don't betray my trust.", exampleTrans: '不要背叛我的信任。', difficulty: 4 },
      { word: 'blame', meaning: '责备；归咎于', phonetic: 'bleɪm', partOfSpeech: 'v./n.', example: "Don't blame others.", exampleTrans: '不要责备别人。', difficulty: 3 },
      { word: 'bother', meaning: '打扰；烦恼', phonetic: 'ˈbɒðə', partOfSpeech: 'v.', example: 'Sorry to bother you.', exampleTrans: '抱歉打扰你。', difficulty: 2 },
      { word: 'boundary', meaning: '边界；分界线', phonetic: 'ˈbaʊndri', partOfSpeech: 'n.', example: 'The river is the boundary.', exampleTrans: '这条河是边界。', difficulty: 4 },
      { word: 'brain', meaning: '大脑；智力', phonetic: 'breɪn', partOfSpeech: 'n.', example: 'Use your brain!', exampleTrans: '动动脑子！', difficulty: 2 },
      { word: 'brand', meaning: '品牌；商标', phonetic: 'brænd', partOfSpeech: 'n.', example: 'This is a famous brand.', exampleTrans: '这是一个著名的品牌。', difficulty: 2 },
      { word: 'brilliant', meaning: '杰出的；灿烂的', phonetic: 'ˈbrɪliənt', partOfSpeech: 'adj.', example: 'That is a brilliant idea!', exampleTrans: '那是个绝妙的主意！', difficulty: 4 },
      { word: 'budget', meaning: '预算', phonetic: 'ˈbʌdʒɪt', partOfSpeech: 'n./v.', example: 'We need to make a budget.', exampleTrans: '我们需要制定预算。', difficulty: 3 },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  for (const wb of wordbooks) {
    const { words, ...wordbookData } = wb;
    const wordbook = await prisma.wordbook.create({
      data: {
        ...wordbookData,
        words: {
          create: words.map(w => ({
            ...w,
            difficulty: w.difficulty || 1,
          })),
        },
      },
    });
    console.log(`  ✓ Created wordbook: ${wordbook.name} (${words.length} words)`);
  }

  // Create a demo user with hashed password
  const hashedPassword = await bcrypt.hash('123456', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@tdtd.com' },
    update: {
      name: 'Demo用户',
      password: hashedPassword,
      dailyGoal: 15,
      credits: 100,
    },
    create: {
      name: 'Demo用户',
      email: 'demo@tdtd.com',
      password: hashedPassword,
      dailyGoal: 15,
      credits: 100,
    },
  });
  console.log(`  ✓ Demo user ready: ${demoUser.email} / password: 123456`);

  // Auto-subscribe demo user to first wordbook
  const firstWordbook = await prisma.wordbook.findFirst({ orderBy: { createdAt: 'asc' } });
  if (firstWordbook) {
    await prisma.userWordbook.upsert({
      where: { userId_wordbookId: { userId: demoUser.id, wordbookId: firstWordbook.id } },
      update: {},
      create: { userId: demoUser.id, wordbookId: firstWordbook.id },
    });
    console.log(`  ✓ Demo user subscribed to: ${firstWordbook.name}`);
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
