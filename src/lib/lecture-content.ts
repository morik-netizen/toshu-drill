// ============================================
// 徒手療法ドリル - Lecture Content
// ============================================

export interface PhotoSlotDef {
  readonly slotId: string
  readonly label: string
}

export interface LectureSection {
  readonly title: string
  readonly content: string // HTML string
  readonly photoSlot?: PhotoSlotDef
}

export interface LectureUnit {
  readonly unitId: string
  readonly title: string
  readonly subtitle: string
  readonly sections: readonly LectureSection[]
}

export const LECTURE_UNITS: readonly LectureUnit[] = [
  // =============================================
  // U01: 基礎理論編
  // =============================================
  {
    unitId: 'U01',
    title: '第1回：基礎理論編',
    subtitle: '関節モビライゼーションの原理と評価',
    sections: [
      {
        title: '関節モビライゼーションとは',
        content: `
<p>関節の機能障害に対して、<strong>関節運動学の原理</strong>に基づき、関節面に対して<strong>他動的な並進運動</strong>（離開・滑り）を加える手技</p>
<table>
  <tr><th>体系</th><th>提唱者</th><th>特徴</th></tr>
  <tr><td><strong>Nordic System</strong></td><td>Kaltenborn（ノルウェー）</td><td>関節運動学の原理に基づくモビライゼーション</td></tr>
  <tr><td><strong>Australian Approach</strong></td><td>Maitland（オーストラリア）</td><td>症候と徴候に対する系統的評価・治療</td></tr>
</table>
<p>本講座では主に<strong>Kaltenbornの体系</strong>を学ぶ</p>
`,
      },
      {
        title: '徒手療法の対象組織',
        content: `
<table>
  <tr><th>対象組織</th><th>手技</th><th>具体例</th></tr>
  <tr><td><strong>関節包・関節面</strong></td><td>関節モビライゼーション</td><td>離開、滑り</td></tr>
  <tr><td>筋・筋膜</td><td>軟部組織モビライゼーション</td><td>ストレッチ、筋膜リリース</td></tr>
  <tr><td>神経</td><td>神経モビライゼーション</td><td>スライダー、テンショナー</td></tr>
  <tr><td>複合</td><td>エクササイズ</td><td>自動・他動運動</td></tr>
</table>
<p>この授業では<strong>関節包・関節面</strong>に対するアプローチ＝<strong>関節モビライゼーション</strong>を中心に学ぶ</p>
`,
      },
      {
        title: 'モビライゼーションの目的と効果',
        content: `
<ul>
  <li>副運動制限・生理的運動制限の<strong>改善</strong></li>
  <li>正常な<strong>関節機能の回復</strong></li>
  <li><strong>疼痛制御</strong>と症状の寛解</li>
  <li>関節内組織の<strong>栄養状態の改善</strong></li>
</ul>
<p><strong>2つの効果：</strong></p>
<ul>
  <li><strong>痛みを抑える</strong>：関節を小さくゆっくり動かし痛みの信号を抑える、筋の過剰な緊張を和らげる</li>
  <li><strong>可動域制限を回復させる</strong>：硬くなった関節包や靱帯を伸張する、関節内の癒着を剥がす</li>
</ul>
<p>痛みが強い時期 → まず痛みを抑える → 落ち着いた後 → 可動域の回復へ</p>
`,
      },
      {
        title: '生理的運動と副運動',
        content: `
<table>
  <tr><th></th><th>生理的運動（骨運動学）</th><th>副運動（関節運動学）</th></tr>
  <tr><td><strong>何の動き？</strong></td><td>骨が空間内で動く</td><td>関節面同士が動く</td></tr>
  <tr><td><strong>見えるか？</strong></td><td>外から見える</td><td>外からは見えない</td></tr>
  <tr><td><strong>測れるか？</strong></td><td>角度計で測定可能（°）</td><td>測定できない</td></tr>
  <tr><td><strong>自分で動かせる？</strong></td><td>動かせる</td><td>動かせない</td></tr>
  <tr><td><strong>例</strong></td><td>膝屈曲130°、肩屈曲180°</td><td>ころがり、すべり、回転</td></tr>
</table>
<p>副運動の基本：<strong>ころがり</strong>（接点が両面で変化）と<strong>すべり</strong>（一方は同じまま）。実際の関節ではこれらが同時に混在する。</p>
`,
      },
      {
        title: '関節可動域の3つの領域',
        content: `
<table>
  <tr><th>領域</th><th>意味</th><th>状態</th></tr>
  <tr><td><strong>自動的関節可動域</strong></td><td>自分の力で動かせる範囲</td><td>自動運動の最終域まで</td></tr>
  <tr><td><strong>生理学的関節可動域</strong></td><td>関節の遊びまで含めた範囲</td><td>＝ 正常</td></tr>
  <tr><td><strong>解剖学的関節可動域</strong></td><td>組織が壊れる限界</td><td>これを超えると捻挫・脱臼</td></tr>
</table>
<p>モビライゼーションは<strong>生理学的関節可動域の中</strong>で行う。解剖学的限界を超えてはいけない。</p>
`,
      },
      {
        title: 'CPPとOPP',
        content: `
<table>
  <tr><th></th><th>CPP（しまりの肢位）</th><th>OPP（ゆるみの肢位）</th></tr>
  <tr><td><strong>関節面</strong></td><td>最大に適合・圧迫</td><td>適合せず弛緩</td></tr>
  <tr><td><strong>靱帯・関節包</strong></td><td>最大緊張</td><td>弛緩</td></tr>
  <tr><td><strong>動き</strong></td><td>ほとんど動かない</td><td>動揺・遊びが生じる</td></tr>
</table>
<p>CPPでは関節がロックされている → モビライゼーションは原則<strong>OPP（ゆるみの肢位）</strong>で実施する</p>
`,
      },
      {
        title: '主要関節のCPP・OPP一覧',
        content: `
<table>
  <tr><th>関節</th><th>CPP（しまり）</th><th>OPP（ゆるみ）</th></tr>
  <tr><td>肩甲上腕関節</td><td>最大外転・外旋</td><td>外転55°・水平内転30°</td></tr>
  <tr><td>肘関節（腕尺）</td><td>最大伸展</td><td>屈曲70°・回外10°</td></tr>
  <tr><td>肘関節（腕橈）</td><td>屈曲90°・回外5°</td><td>解剖学的肢位</td></tr>
  <tr><td>橈骨手根関節</td><td>最大伸展＋最大尺屈</td><td>軽度尺屈・屈伸中間位</td></tr>
  <tr><td>股関節</td><td>最大伸展・最大内旋</td><td>屈曲30°・外転30°・軽度外旋</td></tr>
  <tr><td>膝関節</td><td>最大伸展＋最大外旋</td><td>屈曲25°</td></tr>
  <tr><td>足関節</td><td>最大背屈</td><td>底屈10°</td></tr>
  <tr><td>椎間関節</td><td>最大伸展</td><td>屈伸の中間</td></tr>
</table>
`,
      },
      {
        title: '治療面・離開とすべり',
        content: `
<p><strong>治療面</strong>：凹面側の関節面が作る面。モビライゼーションの方向の基準になる。</p>
<table>
  <tr><th>テクニック</th><th>方向</th><th>目的</th></tr>
  <tr><td><strong>離開</strong></td><td>治療面に直角</td><td>疼痛軽減・関節の遊びの回復</td></tr>
  <tr><td><strong>すべり</strong></td><td>治療面に平行</td><td>特定方向の可動域改善</td></tr>
</table>
`,
      },
      {
        title: '凹凸の原則',
        content: `
<ul>
  <li><strong>凸の法則</strong>：凸面が動く → <strong>反対方向</strong>にすべる</li>
  <li><strong>凹の法則</strong>：凹面が動く → <strong>同じ方向</strong>にすべる</li>
</ul>
<p><strong>合言葉：「凹は同じ、凸は逆」</strong></p>
<p>例：膝関節屈曲（脛骨＝凹）→ 脛骨は後方に動く → 滑りも後方</p>
<p>例：肩関節屈曲（上腕骨頭＝凸）→ 上腕骨は前方に動く → 滑りは後方</p>
`,
      },
      {
        title: 'モビライゼーションのグレード',
        content: `
<table>
  <tr><th>Grade</th><th>名称</th><th>やること</th><th>対応する効果</th></tr>
  <tr><td><strong>I</strong></td><td>Loosening</td><td>たるみを取る</td><td>痛みを抑える</td></tr>
  <tr><td><strong>II</strong></td><td>Tightening</td><td>離開</td><td>痛みを抑える〜可動域回復</td></tr>
  <tr><td><strong>III</strong></td><td>Stretching</td><td>モビライゼーション</td><td>可動域を回復</td></tr>
</table>
<ul>
  <li>Grade I〜II：疼痛軽減 → <strong>安静肢位</strong>で離開を使用</li>
  <li>Grade III：可動域改善 → <strong>治療肢位</strong>（制限方向の最終域）で8〜10秒保持</li>
</ul>
`,
      },
      {
        title: 'エンドフィール（最終感触）',
        content: `
<p>他動的関節運動の最終的な停止感 ― 正常か異常かを判断する手がかり</p>
<table>
  <tr><th>種類</th><th>感触</th><th>例</th></tr>
  <tr><td><strong>Soft</strong></td><td>柔らかい</td><td>膝屈曲（太ももとふくらはぎがぶつかる）</td></tr>
  <tr><td><strong>Firm</strong></td><td>弾力のある硬さ</td><td>足関節背屈（アキレス腱が突っ張る）</td></tr>
  <tr><td><strong>Hard</strong></td><td>硬い</td><td>肘伸展（骨同士がぶつかる）</td></tr>
</table>
`,
      },
      {
        title: '評価から治療までの手順',
        content: `
<p><strong>評価フェーズ：</strong></p>
<ol>
  <li>問診・視診・触診で問題関節を特定</li>
  <li>自動運動テストで制限方向を確認</li>
  <li>他動運動テストでエンドフィール評価（Soft / Firm / Hard）</li>
  <li>Joint Playテストで副運動を評価（Firm＋Firm → モビ適応）</li>
</ol>
<p><strong>治療フェーズ：</strong></p>
<ol start="5">
  <li>凹凸を判断し滑りの方向を決定（凹は同じ、凸は逆）</li>
  <li>OPPでGrade I〜II（離開）→ 疼痛への反応を確認</li>
  <li>治療肢位でGrade III → 8〜10秒保持 × 数セット</li>
  <li>治療前後で再評価 → ROM・痛みの変化を確認</li>
</ol>
`,
      },
      {
        title: '禁忌と注意事項',
        content: `
<p><strong>絶対禁忌（モビライゼーションを行ってはいけない）：</strong></p>
<ul>
  <li>関節の<strong>過剰可動性・不安定性</strong></li>
  <li><strong>急性炎症</strong>・関節浸出液の存在</li>
  <li><strong>強直関節</strong>・靱帯の弛緩</li>
  <li>急性の<strong>神経根症状</strong></li>
</ul>
<p><strong>注意を要する状態：</strong></p>
<ul>
  <li>関節置換術後 / 数ヶ月以内の外傷 / 骨粗鬆症 / 骨端成長板が未閉鎖</li>
</ul>
`,
      },
    ],
  },

  // =============================================
  // U02: 足関節のモビライゼーション
  // =============================================
  {
    unitId: 'U02',
    title: '第2回：足関節のモビライゼーション',
    subtitle: '距腿関節・脛腓関節',
    sections: [
      {
        title: '足関節と足部の関節一覧',
        content: `
<table>
  <tr><th>関節</th><th>凹側</th><th>凸側</th><th>主な運動</th></tr>
  <tr><td><strong>距腿関節</strong></td><td>脛骨腓骨の遠位端</td><td>距骨</td><td>背屈・底屈</td></tr>
  <tr><td><strong>遠位脛腓関節</strong></td><td>—</td><td>—</td><td>腓骨の滑り</td></tr>
  <tr><td><strong>近位脛腓関節</strong></td><td>—</td><td>—</td><td>腓骨頭の滑り</td></tr>
  <tr><td>距骨下関節</td><td>前踵骨関節面</td><td>後踵骨関節面</td><td>回内・回外</td></tr>
</table>
`,
      },
      {
        title: '距腿関節の解剖',
        content: `
<ul>
  <li>距骨滑車が<strong>凸面</strong>を形成</li>
  <li>脛腓骨の遠位端が<strong>凹面</strong>（ほぞ穴）を形成</li>
</ul>
<p><strong>運動軸</strong>：下腿軸に対して約80°</p>
<ul>
  <li>背屈時：足底はやや外側（回内）に向く</li>
  <li>底屈時：足底はやや内側（回外）に向く</li>
</ul>
`,
      },
      {
        title: '距骨傾斜角',
        content: `
<ul>
  <li>脛骨関節面の下縁と距骨上縁のなす角</li>
  <li>検査方法：約30°底屈位で足関節の内反強制を行い、X線前後像を撮影</li>
  <li>正常値：<strong>0〜5°</strong></li>
  <li>異常な場合 → <strong>ATFL・CFL・関節包前方の断裂</strong>を疑う</li>
</ul>
`,
      },
      {
        title: '複合運動',
        content: `
<ul>
  <li>距骨滑車は先端が内側を向いた<strong>円錐形</strong></li>
  <li>距骨滑車の可動域は内側 ＜ 外側</li>
  <li>運動には小さな回旋運動が連結する</li>
</ul>
<table>
  <tr><th>運動</th><th>距骨の回旋</th></tr>
  <tr><td><strong>背屈時</strong></td><td>下腿の外側に約5°回旋</td></tr>
  <tr><td><strong>底屈時</strong></td><td>下腿の内側に約5°回旋</td></tr>
</table>
`,
      },
      {
        title: '距腿関節：離開',
        content: `
<p><strong>目的</strong>：疼痛軽減・底屈/背屈制限の改善</p>
<p><strong>開始肢位</strong>：膝下にタオルを入れる</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>内側の手で把持、その上に外側の手を重ねる</li>
  <li>少し尺屈を入れながら、脇を締め離開させる</li>
  <li>グレード I〜II を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'talocrural-traction',
          label: '距腿関節の離開',
        },
      },
      {
        title: '距腿関節：背側滑り',
        content: `
<p><strong>目的</strong>：背屈制限の改善</p>
<p><strong>開始肢位</strong>：背屈制限の最終域で、膝下にタオル</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>下腿遠位を把持し、内果の下端から距骨をみつける</li>
  <li>距骨前方中央にwebを当てる</li>
  <li>背側方向にグレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'talocrural-dorsal-glide',
          label: '距腿関節の背側滑り',
        },
      },
      {
        title: '距腿関節：腹側滑り',
        content: `
<p><strong>目的</strong>：底屈制限の改善</p>
<p><strong>開始肢位</strong>：ベッドの端にタオルを入れる</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>下腿遠位を把持し、内果の下端から距骨をみつける</li>
  <li>距骨後方中央にwebを当てる</li>
  <li>膝の屈伸を使って床方向（腹側方向）に押し込む</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'talocrural-ventral-glide',
          label: '距腿関節の腹側滑り',
        },
      },
      {
        title: '遠位脛腓関節・下腿骨間膜',
        content: `
<ul>
  <li>前脛腓靱帯・後脛腓靱帯・骨間膜で連結し、両下腿骨をまとめる安定作用</li>
  <li>背屈時：腓骨果部は<strong>上方・後方</strong>へ動く</li>
  <li>底屈時：腓骨果部は<strong>下方・前方</strong>へ動く</li>
</ul>
`,
      },
      {
        title: '遠位脛腓関節：外果の前方・後方滑り',
        content: `
<p><strong>目的</strong>：背屈・底屈制限の改善</p>
<p><strong>開始肢位</strong>：踵に薄くタオルを敷き軽度底屈位、下腿を約20°内旋させる</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>脛骨を把持し、母指で皮膚をよじってヒールで外果を把持</li>
  <li>背屈制限 → 外果を後方へ滑らせる</li>
  <li>底屈制限 → 4指で手前に引きつける</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'distal-tibiofibular-glide',
          label: '遠位脛腓関節の外果滑り',
        },
      },
      {
        title: '近位脛腓関節：腓骨頭の前方・後方滑り',
        content: `
<p><strong>目的</strong>：背屈・底屈制限の改善</p>
<p><strong>開始肢位</strong>：膝軽度屈曲位</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>背屈制限 → 腓骨頭を手前へ滑らせる</li>
  <li>底屈制限 → 腓骨頭を背側へ押し込む</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'proximal-tibiofibular-glide',
          label: '近位脛腓関節の腓骨頭滑り',
        },
      },
    ],
  },

  // =============================================
  // U03: 足部のモビライゼーション
  // =============================================
  {
    unitId: 'U03',
    title: '第3回：足部のモビライゼーション',
    subtitle: '距骨下・踵立方・距舟・リスフラン・MTP関節',
    sections: [
      {
        title: '距骨下関節の解剖',
        content: `
<ul>
  <li>後距骨関節面＝<strong>凸面</strong></li>
  <li>中距骨関節面＝<strong>凹面</strong></li>
  <li>前距骨関節面＝<strong>凹面</strong></li>
</ul>
`,
      },
      {
        title: '距骨下関節の運動軸（ヘンケ軸）',
        content: `
<ul>
  <li>距骨頸の上内側から足根洞を通り、踵骨隆起外側突起に出る</li>
  <li>回外時：後距骨関節面は外側に滑る</li>
  <li>回内時：後距骨関節面は内側に滑る</li>
</ul>
<p><strong>回外</strong>（底屈/内転/内返し）：踵骨が内側下方へ回旋、可動域20〜30°</p>
<p><strong>回内</strong>（背屈/外転/外がえし）：踵骨が外側上方へ回旋</p>
`,
      },
      {
        title: '距骨下関節：離開',
        content: `
<p><strong>目的</strong>：疼痛軽減・回外/回内制限の改善</p>
<p><strong>開始肢位</strong>：前足部を少しベッドの端から出す</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>一方の手を足関節前面から添える</li>
  <li>もう一方の手でお椀を作るように踵を包み込む</li>
  <li>そのまま斜め45°床方向に離開する</li>
  <li>グレード I〜II を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'subtalar-traction',
          label: '距骨下関節の離開',
        },
      },
      {
        title: '距骨下関節：腓骨/脛骨方向滑り',
        content: `
<p><strong>開始肢位</strong>：背臥位で下腿中央をベッドの端に。術者は椅子に座り、前足部をお腹にそっとかける</p>
<p><strong>把持</strong>：頭側の手で内果真下から距骨を母指・示指でつまむ / 尾側の手で踵骨を母指・示指でつまむ</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>回内制限 → 腓骨方向へ回す</li>
  <li>回外制限 → 脛骨方向へ回す</li>
  <li>ヘンケ軸の方向に沿って回す</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'subtalar-fibular-tibial-glide',
          label: '距骨下関節の腓骨/脛骨方向滑り',
        },
      },
      {
        title: '踵立方関節',
        content: `
<ul>
  <li>踵骨と立方骨で構成（ショパール関節の外側部分）</li>
  <li><strong>斜軸</strong>：底屈/内転 ↔ 背屈/外転</li>
  <li><strong>縦軸</strong>：回内 ↔ 回外</li>
</ul>
`,
      },
      {
        title: '踵立方関節：回内・回外への滑り',
        content: `
<p><strong>目的</strong>：回内・回外制限の改善</p>
<p><strong>開始肢位</strong>：足首から下をベッドの端から出す</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>内側の手：舟状骨を底側1/2・背側3/5のエリアでつまむ</li>
  <li>外側の手：第5中足骨基底部の根元の立方骨を底側1/2・外側2/5のエリアでつまむ</li>
  <li>舟状骨を固定しながら立方骨を滑らせる</li>
  <li>回内制限 → 背側へ滑らせる</li>
  <li>回外制限 → 底側へ滑らせる</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'calcaneocuboid-glide',
          label: '踵立方関節の滑り',
        },
      },
      {
        title: '距舟関節：回内方向への滑り',
        content: `
<p><strong>目的</strong>：回内制限の改善</p>
<p><strong>開始肢位</strong>：背臥位、膝を曲げて踵を立てる</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>頭側の手：距骨の前方中央部にwebを当てる</li>
  <li>尾側の手：舟状骨結節を探し、舟状骨の背側部に母指のMP関節部をコンタクト</li>
  <li>回転させるイメージで膝の屈伸を使い床方向にモビライゼーション</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'talonavicular-pronation-glide',
          label: '距舟関節の回内方向滑り',
        },
      },
      {
        title: '距舟関節：回外方向への滑り',
        content: `
<p><strong>目的</strong>：回外制限の改善</p>
<p><strong>開始肢位</strong>：腹臥位、下腿遠位〜足関節前面にタオルを薄く敷く。内果をベッドの端に合わせる</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>内側の手の母指で舟状骨を底側からコンタクト</li>
  <li>外側の手の尺側で、その母指を押すように背側方向へモビライゼーション</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'talonavicular-supination-glide',
          label: '距舟関節の回外方向滑り',
        },
      },
      {
        title: 'リスフラン関節の解剖',
        content: `
<ul>
  <li>楔状骨（I〜III）・立方骨と中足骨底で構成</li>
  <li>関節線は斜行している</li>
  <li>ショパール関節：回内・回外がメイン</li>
  <li>リスフラン関節：底屈・背屈がメイン</li>
  <li>第1足根中足関節では第1中足骨底を<strong>遠位内側方向</strong>に離開する</li>
</ul>
`,
      },
      {
        title: 'リスフラン関節：離開',
        content: `
<p><strong>目的</strong>：リスフラン関節の可動性改善</p>
<p><strong>開始肢位</strong>：背臥位・膝屈曲位、動かす関節の端をウェッジの端に合わせる</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>外側リスフラン → 足部の内側に立つ</li>
  <li>内側リスフラン → 足部の外側に立つ</li>
  <li>内側：楔状骨を固定し、第1〜第3中足骨をそれぞれ離開</li>
  <li>外側：立方骨を固定し、第4・第5中足骨をそれぞれ離開</li>
  <li>足根骨・中足骨ともにつまみ握り（pinch grasp）で把持</li>
  <li>グレード I〜II を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'lisfranc-traction',
          label: 'リスフラン関節の離開',
        },
      },
      {
        title: 'リスフラン関節：底側・背側滑り',
        content: `
<p><strong>目的</strong>：屈曲・背屈制限の改善</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>離開と同じ把持・開始肢位で行う</li>
  <li>屈曲制限 → 中足骨底を底側へ滑らせる</li>
  <li>背屈制限 → 中足骨底を背側へ滑らせる</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'lisfranc-plantar-dorsal-glide',
          label: 'リスフラン関節の底側/背側滑り',
        },
      },
      {
        title: 'MTP関節：離開・底側/背側滑り',
        content: `
<p><strong>目的</strong>：</p>
<ul>
  <li>離開：すべての方向の可動域改善・疼痛軽減</li>
  <li>底側滑り：屈曲制限の改善</li>
  <li>背側滑り：伸展制限の改善</li>
</ul>
<p><strong>開始肢位</strong>：背臥位・膝屈曲位、MTP関節をウェッジの端に合わせる</p>
<p><strong>把持</strong>：</p>
<ul>
  <li>頭側の手：中足骨頭の最も遠位部をつまみ握り（pinch grasp）で固定</li>
  <li>尾側の手：基節骨の最も近位部を引っ掛け握り（hook grasp）で把持</li>
</ul>
<p><strong>手技</strong>：離開はグレード I〜II、滑りはグレード III を繰り返す</p>
`,
        photoSlot: {
          slotId: 'mtp-traction-glide',
          label: 'MTP関節の離開と滑り',
        },
      },
    ],
  },

  // =============================================
  // U04: 膝関節・股関節のモビライゼーション
  // =============================================
  {
    unitId: 'U04',
    title: '第4回：膝関節・股関節のモビライゼーション',
    subtitle: '膝関節・膝蓋骨・股関節',
    sections: [
      {
        title: '膝関節の運動',
        content: `
<ul>
  <li>凹面＝脛骨 / 凸面＝大腿骨</li>
  <li>屈曲角度により運動軸が移動する</li>
  <li>屈曲開始時：転がりが主 / 屈曲終了時：滑りが主</li>
</ul>
`,
      },
      {
        title: '終末回旋',
        content: `
<ul>
  <li>完全伸展時に脛骨が<strong>外旋</strong>する</li>
  <li>膝関節のロック機構（screw home mechanism）</li>
  <li>内側顆の関節面が外側顆より大きいことによる</li>
</ul>
`,
      },
      {
        title: '膝関節の生理的運動と副運動',
        content: `
<p>凹面：脛骨粗面 / 凸面：大腿骨顆</p>
<table>
  <tr><th></th><th>膝伸展の促通</th><th>膝屈曲の促通</th></tr>
  <tr><td><strong>OKC</strong></td><td>脛骨の転がりと腹側すべり</td><td>脛骨の転がりと背側すべり</td></tr>
  <tr><td><strong>CKC</strong></td><td>大腿骨の腹側転がりと背側すべり</td><td>大腿骨の背側転がりと腹側すべり</td></tr>
</table>
<p>凸の法則：OKCでは転がりと滑りが反対方向 / 凹の法則：CKCでは転がりと滑りが同方向</p>
`,
      },
      {
        title: '膝関節：離開（端座位）',
        content: `
<p><strong>目的</strong>：疼痛軽減・可動域改善</p>
<p><strong>開始肢位</strong>：端座位</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>下腿の近位部を両手で把持</li>
  <li>そのまま下腿長軸方向（床方向）へ離開する</li>
  <li>グレード I〜II を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'knee-traction-sitting',
          label: '膝関節の離開（端座位）',
        },
      },
      {
        title: '膝関節：離開（背臥位）',
        content: `
<p><strong>目的</strong>：疼痛軽減・可動域改善</p>
<p><strong>開始肢位</strong>：背臥位、膝・股関節ともに約90°屈曲。患者の下腿を術者の大腿に乗せる</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>頭側の手：大腿遠位を後面から把持</li>
  <li>尾側の手：下腿近位を把持し、示指を関節裂隙に当てる</li>
  <li>肩の力を使って離開しながら、どのくらい離開できるか確認する</li>
  <li>グレード I〜II を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'knee-traction-supine',
          label: '膝関節の離開（背臥位）',
        },
      },
      {
        title: '膝関節：背側滑り（座位）',
        content: `
<p><strong>目的</strong>：屈曲制限の改善</p>
<p><strong>開始肢位</strong>：腹臥位、膝をベッドの端に置く</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>術者は患者の足部を肩に乗せる</li>
  <li>両手で下腿近位を把持</li>
  <li>そのまま背側方向へモビライゼーション</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'knee-dorsal-glide-sitting',
          label: '膝関節の背側滑り',
        },
      },
      {
        title: '膝関節：背側滑り（腹臥位）',
        content: `
<p><strong>目的</strong>：屈曲制限の改善</p>
<p><strong>開始肢位</strong>：腹臥位、膝をベッドの端に置く</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>一方の手で下腿の近位前面を把持</li>
  <li>もう一方の手で下腿の遠位前面を把持</li>
  <li>膝の屈曲が入らないように、背側へモビライゼーション</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'knee-dorsal-glide-prone',
          label: '膝関節の背側滑り（腹臥位）',
        },
      },
      {
        title: '膝関節：背側滑り（AKA）',
        content: `
<p><strong>目的</strong>：屈曲制限の改善</p>
<p><strong>開始肢位</strong>：背臥位、膝・股関節ともに約90°屈曲。患者の下腿を術者の大腿に乗せる</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>両手で下腿近位を把持</li>
  <li>そのままベッド方向（背側方向）へモビライゼーション</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'knee-dorsal-glide-aka',
          label: '膝関節の背側滑り（AKA）',
        },
      },
      {
        title: '膝関節：腹側滑り',
        content: `
<p><strong>目的</strong>：伸展制限の改善</p>
<p><strong>開始肢位</strong>：背臥位、大腿遠位前面にうっすらとタオルを敷く</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>頭側の手で下腿近位後面を把持</li>
  <li>もう一方の手で下腿を把持</li>
  <li>腰の回旋を使いながら腹側方向へモビライゼーション</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'knee-ventral-glide',
          label: '膝関節の腹側滑り',
        },
      },
      {
        title: '大腿骨顆部の背側滑り',
        content: `
<p><strong>目的</strong>：伸展制限の改善</p>
<p><strong>開始肢位</strong>：背臥位</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>尾側の手で下腿近位を把持</li>
  <li>頭側の手で大腿遠位を前面からコンタクト</li>
  <li>頭側の手を少し内旋気味にしながら背側へ押し込む</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'femoral-condyle-dorsal-glide',
          label: '大腿骨顆部の背側滑り',
        },
      },
      {
        title: '脛骨顆部の滑り',
        content: `
<p><strong>目的</strong>：屈曲制限・伸展制限の改善</p>
<p><strong>開始肢位</strong>：背臥位、大腿遠位後面にタオルを敷く</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>頭側の手で脛骨近位の内側顆または外側顆を把持</li>
  <li>尾側の手で下腿遠位を把持</li>
  <li>内側顆に当てた手のヒールで押し込む → 屈曲制限のアプローチ</li>
  <li>外側顆に当てた手のヒールで押し込む → 伸展制限のアプローチ</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'tibial-condyle-glide',
          label: '脛骨顆部の滑り',
        },
      },
      {
        title: '膝蓋骨の解剖',
        content: `
<ul>
  <li>膝蓋骨底（上縁）：大腿四頭筋が付着</li>
  <li>膝蓋骨尖（下縁）：膝蓋靱帯が付着</li>
  <li>垂直に走る隆起により内側面と外側面に分かれる</li>
  <li>大腿骨膝蓋面と関節する</li>
</ul>
`,
      },
      {
        title: '膝蓋骨：尾側方向への滑り',
        content: `
<p><strong>目的</strong>：膝蓋骨の全方向への可動域の改善</p>
<p><strong>完全伸展位での方法</strong>：</p>
<ul>
  <li>膝裏に一方の手を当てる</li>
  <li>お椀を作り、もう一方の手で膝蓋骨を上から包み込む</li>
  <li>ベッドと平行に膝蓋骨を尾側方向へ滑らせる</li>
</ul>
<p><strong>最大屈曲位での方法</strong>：</p>
<ul>
  <li>お椀を作り、膝蓋骨に当てる</li>
  <li>その上にもう一方の手を重ねる</li>
  <li>下腿長軸方向に膝蓋骨を滑らせる</li>
</ul>
<p>いずれもグレード III を繰り返す</p>
`,
        photoSlot: {
          slotId: 'patella-caudal-glide',
          label: '膝蓋骨の尾側方向滑り',
        },
      },
      {
        title: '股関節の関節学と関節運動学',
        content: `
<p>凹面：臼蓋窩 / 凸面：大腿骨頭</p>
<table>
  <tr><th>運動</th><th>大腿骨頭の動き</th></tr>
  <tr><td><strong>屈曲</strong></td><td>臼蓋窩の背側にすべる</td></tr>
  <tr><td><strong>伸展</strong></td><td>臼蓋窩の腹側にすべる</td></tr>
  <tr><td><strong>外転</strong></td><td>臼蓋の内側にすべる</td></tr>
  <tr><td><strong>内転</strong></td><td>臼蓋の外側にすべる</td></tr>
  <tr><td><strong>内旋</strong></td><td>臼蓋の背側かつ外側にすべる</td></tr>
  <tr><td><strong>外旋</strong></td><td>臼蓋の腹側かつ内側にすべる</td></tr>
</table>
<p>凸の法則：大腿骨頭（凸）が動くため、ころがりとすべりは反対方向</p>
`,
      },
      {
        title: '股関節：尾側への離開',
        content: `
<p><strong>目的</strong>：疼痛軽減・可動域改善</p>
<p><strong>開始肢位</strong>：背臥位</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>内果と外果より上のところを両手で把持</li>
  <li>尾側方向へ軽く離開する</li>
  <li>グレード I〜II を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'hip-caudal-traction',
          label: '股関節の尾側離開',
        },
      },
      {
        title: '股関節：尾側＋外側方向への離開',
        content: `
<p><strong>目的</strong>：可動域改善</p>
<p><strong>開始肢位</strong>：背臥位、股関節と膝関節を屈曲</p>
<p><strong>手技</strong>：</p>
<ul>
  <li>鼠径部に尾側の手の尺側をコンタクト</li>
  <li>反対の手をその上に重ねる</li>
  <li>鼠径部の奥へ押し込む</li>
  <li>前腕を回外するようにして、自分の胸の方向に引きつけて離開する</li>
  <li>グレード III を繰り返す</li>
</ul>
`,
        photoSlot: {
          slotId: 'hip-caudal-lateral-traction',
          label: '股関節の尾側＋外側離開',
        },
      },
    ],
  },

  // =============================================
  // U05: 仙腸関節の評価法と治療法
  // =============================================
  {
    unitId: 'U05',
    title: '第5回：仙腸関節の評価法と治療法',
    subtitle: '仙腸関節の解剖と評価の基礎',
    sections: [
      {
        title: '今日の目標',
        content:
          '<ul>' +
          '<li>仙腸関節の<strong>解剖</strong>と<strong>運動</strong>（ニューテーション／カウンターニューテーション）を理解する</li>' +
          '<li><strong>効き目検査</strong>を実施できる</li>' +
          '<li>骨盤・仙骨の<strong>ランドマーク</strong>を触診できる</li>' +
          '<li><strong>SS</strong>と<strong>ILA</strong>の評価ができる</li>' +
          '<li>仙骨の<strong>前傾</strong>と<strong>後傾</strong>を簡易的に判断できる</li>' +
          '</ul>',
      },
      {
        title: '仙腸関節の解剖',
        content:
          '<p><strong>関節面</strong></p>' +
          '<ul>' +
          '<li>関節面に凹凸がある</li>' +
          '<li>仙骨関節面：硝子軟骨 ／ 腸骨関節面：線維性軟骨</li>' +
          '<li>軟骨の厚さ：仙骨（約2〜3mm）＞ 腸骨</li>' +
          '</ul>' +
          '<p><strong>運動軸</strong></p>' +
          '<ul>' +
          '<li>運動軸は<strong>S2</strong>（S2のすぐ前方に重心線が通過）</li>' +
          '<li>運動量はわずか</li>' +
          '</ul>' +
          '<p><strong>受容器</strong></p>' +
          '<ul><li>パチニ・ルフィニ小体はなく、<strong>侵害受容器</strong>が多い</li></ul>',
      },
      {
        title: 'ニューテーションとカウンターニューテーション',
        content:
          '<p><strong>Nutation（ニューテーション）</strong></p>' +
          '<ul><li>仙骨の<strong>前傾</strong> → 腰椎前弯増強</li></ul>' +
          '<p><strong>Counter-nutation（カウンターニューテーション）</strong></p>' +
          '<ul><li>仙骨の<strong>後傾</strong> → 腰椎前弯減少</li></ul>',
      },
      {
        title: '効き目検査',
        content:
          '<p>骨盤評価の際に、術者が<strong>利き目側</strong>に立つために確認する</p>' +
          '<ul>' +
          '<li>Step 1：両腕を伸ばし、両手の母指と示指で小さな円を作る</li>' +
          '<li>Step 2：両目を開き、円から遠方の目標物を見ながら円をできるだけ小さくする</li>' +
          '<li>Step 3：片目ずつ閉じる</li>' +
          '<li>Step 4：片目でも目標物が見えている方が<strong>利き目</strong></li>' +
          '</ul>',
        photoSlot: { slotId: 'dominant-eye-test', label: '効き目検査' },
      },
      {
        title: '骨盤・仙骨のランドマーク',
        content:
          '<p><strong>仙骨</strong></p>' +
          '<ul>' +
          '<li>正中仙骨稜・中間仙骨稜・外側仙骨稜</li>' +
          '<li>仙骨下外側角（ILA）</li>' +
          '<li>上関節面・耳状面・仙骨管裂孔</li>' +
          '<li>仙骨溝（sacral sulcus：SS）</li>' +
          '</ul>' +
          '<p><strong>腸骨・その他</strong></p>' +
          '<ul>' +
          '<li>PSIS（ASISより2横指ほど低位）</li>' +
          '<li>腸骨稜・坐骨結節・尾骨</li>' +
          '</ul>',
        photoSlot: { slotId: 'sij-landmarks', label: '骨盤・仙骨ランドマーク触診' },
      },
      {
        title: 'SS（仙骨溝）の評価',
        content:
          '<p><strong>手順</strong></p>' +
          '<ul>' +
          '<li>利き目を棘突起に合わせる</li>' +
          '<li>母指と示指をL字にする</li>' +
          '<li>PSISを触知後、やや内側・やや上方に母指のIPを少し曲げて仙骨溝の<strong>深さ</strong>を評価する</li>' +
          '</ul>',
        photoSlot: { slotId: 'ss-assessment', label: 'SS（仙骨溝）の評価' },
      },
      {
        title: 'ILA（仙骨下外側角）の評価',
        content:
          '<p><strong>手順</strong></p>' +
          '<ul>' +
          '<li>母指と示指をL字にする</li>' +
          '<li>両母指をILAにあて、左右の<strong>高低差</strong>を評価する</li>' +
          '</ul>',
        photoSlot: { slotId: 'ila-assessment', label: 'ILA（仙骨下外側角）の評価' },
      },
      {
        title: '仙骨の前傾・後傾の判断',
        content:
          '<table>' +
          '<tr><th>評価項目</th><th>前傾（Nutation）</th><th>後傾（Counter-nutation）</th></tr>' +
          '<tr><td>SSの深さ</td><td>左右とも<strong>深い</strong></td><td>左右とも<strong>浅い</strong></td></tr>' +
          '<tr><td>ILAの位置</td><td>左右とも<strong>浅い</strong></td><td>左右とも<strong>深い</strong></td></tr>' +
          '<tr><td>腰椎の前弯</td><td><strong>増大</strong>気味</td><td><strong>減少</strong>気味</td></tr>' +
          '<tr><td>LST</td><td>前弯があり、たわむように感じる</td><td>前弯が少なく、たわむ感じが少ない</td></tr>' +
          '<tr><td>下肢長</td><td>左右とも均等</td><td>左右とも均等</td></tr>' +
          '</table>',
      },
      {
        title: 'LST（腰椎スプリングテスト）',
        content:
          '<p><strong>手順</strong></p>' +
          '<ul>' +
          '<li>腰椎前弯の程度を視診・触診する（ASISの方がPSISより2横指低い）</li>' +
          '<li>手根部を中部〜下部腰椎の棘突起上に置く</li>' +
          '<li>手根部で腰椎を素早く押して、腰椎の<strong>弾力性</strong>を評価する</li>' +
          '</ul>' +
          '<p><strong>判定</strong></p>' +
          '<ul>' +
          '<li>Nutation：前弯があり、<strong>たわむように</strong>感じる</li>' +
          '<li>Counter-nutation：前弯が少なく、たわむ感じが<strong>少ない</strong></li>' +
          '</ul>',
        photoSlot: { slotId: 'lst-spring-test', label: 'LST（腰椎スプリングテスト）' },
      },
      {
        title: '脚長差の判定',
        content:
          '<p><strong>腹筋が使える人の場合</strong></p>' +
          '<ul>' +
          '<li>背臥位で足首を両手で把持する</li>' +
          '<li>腹筋で上体を持ち上げてもらい、長座位に</li>' +
          '<li>内果の下端に両示指を合わせて脚長差を比較する</li>' +
          '</ul>' +
          '<p><strong>腹筋が使えない人の場合</strong></p>' +
          '<ul>' +
          '<li>両膝を立てた背臥位で臀部を一度持ち上げさせ、下ろす</li>' +
          '<li>そのまま膝を伸ばし、内果の下端で脚長差を比較する</li>' +
          '</ul>' +
          '<p>カルテには<strong>短い方</strong>を記載する</p>',
        photoSlot: { slotId: 'leg-length-test', label: '脚長差の判定' },
      },
      {
        title: '仙骨の機能異常まとめ',
        content:
          '<table>' +
          '<tr><th>診断</th><th>SiFBT</th><th>SS</th><th>ILA</th><th>LST</th><th>腰椎前弯</th><th>下肢長</th></tr>' +
          '<tr><td>左右対称の屈曲</td><td>両側</td><td>腹（深い）</td><td>背（浅い）</td><td>たわむ</td><td>増大</td><td>均等</td></tr>' +
          '<tr><td>左右対称の伸展</td><td>両側</td><td>背（浅い）</td><td>腹（深い）</td><td>たわまない</td><td>減少</td><td>均等</td></tr>' +
          '</table>',
      },
    ],
  },

  // =============================================
  // U06: 仙腸関節の評価と治療法2
  // =============================================
  {
    unitId: 'U06',
    title: '第6回：仙腸関節の評価と治療法2',
    subtitle: 'SiFBTと仙骨のモビライゼーション',
    sections: [
      {
        title: '仙骨のニューテーションと診断手順',
        content:
          '<p>以下の全てが揃えば、仙骨は<strong>ニューテーション</strong>にあると診断できる：</p>' +
          '<ul>' +
          '<li>SiFBT検査で、左右とも同時にPSISが動き出す</li>' +
          '<li>SSは左右とも深い</li>' +
          '<li>ILAは左右とも浅い</li>' +
          '<li>腰椎前弯は増強気味</li>' +
          '<li>LSTすると、たわむように感じる</li>' +
          '<li>下肢長は均等</li>' +
          '</ul>',
      },
      {
        title: 'SiFBT（坐位前屈検査）',
        content:
          '<p>仙骨の異常をみる検査法。坐位ではハムストリングスを阻害因子から除外できる。</p>' +
          '<p><strong>開始肢位</strong></p>' +
          '<ul>' +
          '<li>背無し椅子またはベッドに腰掛ける</li>' +
          '<li>左右の坐骨結節に体重を均等にかける</li>' +
          '<li>両足を床に平らに置き、両膝を離す</li>' +
          '</ul>' +
          '<p><strong>手順</strong></p>' +
          '<ul>' +
          '<li>皮膚をずらしてPSISを触知する</li>' +
          '<li>上肢を膝の間に入れ、顎を引いたまま頭部から順に前屈させる</li>' +
          '<li>PSISの動きに母指を追随し、動き出す<strong>早さ</strong>と<strong>到達位置</strong>を左右で比較する</li>' +
          '</ul>' +
          '<p><strong>判定</strong>：PSISがより頭側・腹側へ変位した側が<strong>可動性低下側</strong></p>' +
          '<p>立位検査（＋）座位検査（−）→ ハムストリングスの短縮等<br>' +
          '立位検査（＋）座位検査（＋）→ 仙腸関節機能障害</p>',
        photoSlot: { slotId: 'sifbt', label: 'SiFBT（坐位前屈検査）' },
      },
      {
        title: '仙骨のねじれ（トーション）',
        content:
          '<p>仙骨は前屈・後屈以外にも<strong>ねじれ</strong>という動きがある。</p>' +
          '<ul>' +
          '<li>前方ねじれと後方ねじれは、触診では<strong>全く一緒</strong>に感じる</li>' +
          '<li>出現率：<strong>85％</strong></li>' +
          '</ul>' +
          '<p>左にねじっている場合（左斜軸の前方左ねじれ or 右斜軸の後方左ねじれ）：</p>' +
          '<table>' +
          '<tr><th></th><th>左斜軸の前方左ねじれ</th><th>右斜軸の後方左ねじれ</th></tr>' +
          '<tr><td>SSの深さ</td><td>右が深い</td><td>右が深い</td></tr>' +
          '<tr><td>ILA</td><td>左が浅い</td><td>左が浅い</td></tr>' +
          '<tr><td>SiFBT</td><td><strong>右が陽性</strong></td><td><strong>左が陽性</strong></td></tr>' +
          '<tr><td>LET</td><td>改善</td><td>悪化</td></tr>' +
          '</table>',
      },
      {
        title: 'LET（lumbar extension test）',
        content:
          '<p><strong>手順</strong></p>' +
          '<ul>' +
          '<li>腹臥位にて両SSを触知し、<strong>スフィンクス</strong>にならせる</li>' +
          '<li>腰椎伸展時に、仙骨の相対的な屈曲を伴う</li>' +
          '</ul>' +
          '<p><strong>判定</strong></p>' +
          '<ul>' +
          '<li>ニューテーション（前方ねじれ）→ 両SSの深さは揃う → <strong>改善</strong></li>' +
          '<li>カウンターニューテーション（後方ねじれ）→ SSの非対称性が強まる → <strong>悪化</strong></li>' +
          '</ul>',
        photoSlot: { slotId: 'let-extension-test', label: 'LET（腰椎伸展テスト）' },
      },
      {
        title: '仙骨の機能異常まとめ（ねじれ）',
        content:
          '<table>' +
          '<tr><th>診断</th><th>SiFBT</th><th>SS</th><th>ILA</th><th>LET</th><th>腰椎前弯</th><th>下肢長</th></tr>' +
          '<tr><td>前方ねじれ（左斜軸・左捻転）</td><td>右</td><td>右−腹</td><td>左−背</td><td>改善</td><td>増大</td><td>左短</td></tr>' +
          '<tr><td>前方ねじれ（右斜軸・右捻転）</td><td>左</td><td>左−腹</td><td>右−背</td><td>改善</td><td>増大</td><td>右短</td></tr>' +
          '<tr><td>後方ねじれ（右斜軸・左捻転）</td><td>左</td><td>左−背</td><td>右−腹</td><td>悪化</td><td>減少</td><td>左短</td></tr>' +
          '<tr><td>後方ねじれ（左斜軸・右捻転）</td><td>右</td><td>右−背</td><td>左−腹</td><td>悪化</td><td>減少</td><td>右短</td></tr>' +
          '</table>',
      },
      {
        title: '左斜軸ニューテーションのモビ（カウンターニューテーション方向）',
        content:
          '<p><strong>適応</strong>：仙骨斜軸変位（左斜軸 仙骨前方左ねじれ85%、右斜軸 仙骨前方右ねじれ15%）</p>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>右母指球で腸骨を固定する</li>' +
          '<li>左手小指球部をILAにあて、呼気時に腹側・尾側方向に押し、吸気時に保持する</li>' +
          '<li>仙骨は右上方に動く</li>' +
          '<li>吐く時にグレード III を繰り返す</li>' +
          '</ul>' +
          '<p>腸骨は押し込まない。<strong>固定するのみ</strong></p>' +
          '<p>ニューテさせるときはHipは必ず<strong>外旋（OPP）</strong>に</p>',
        photoSlot: { slotId: 'sij-nutation-mob', label: '仙骨ニューテーションモビ（左斜軸）' },
      },
      {
        title: '右斜軸カウンターニューテーションに対するニューテーションへのモビ',
        content:
          '<p><strong>適応</strong>：仙骨右斜軸カウンターニューテーション偏位</p>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>腹臥位で、ニューテさせる側のHip外旋、反対は内旋</li>' +
          '<li>左ASISを固定</li>' +
          '<li>豆状骨遠位または母指にて左SSに当てる</li>' +
          '<li>吐く時にグレード III を繰り返す</li>' +
          '</ul>' +
          '<p>ニューテさせるときはHipは必ず<strong>外旋（OPP）</strong>に</p>',
        photoSlot: { slotId: 'sij-counter-to-nutation-mob', label: '右斜軸カウンターニューテーション→ニューテーションモビ' },
      },
      {
        title: '右斜軸ニューテーションに対するカウンターニューテーションへのモビ',
        content:
          '<p><strong>適応</strong>：仙骨右斜軸ニューテーション偏位</p>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>腹臥位で、カウンターさせる側Hip内旋、反対は外旋</li>' +
          '<li>左PSISを固定</li>' +
          '<li>豆状骨遠位または母指にて右ILAに当てる</li>' +
          '<li>吸気時にグレード III を繰り返す</li>' +
          '</ul>' +
          '<p>カウンターさせるときはHipは必ず<strong>内旋（CPP）</strong>に</p>',
        photoSlot: { slotId: 'sij-nutation-to-counter-mob', label: '右斜軸ニューテーション→カウンターニューテーションモビ' },
      },
    ],
  },

  // =============================================
  // U07: 骨盤の評価と治療法
  // =============================================
  {
    unitId: 'U07',
    title: '第7回：骨盤の評価と治療法',
    subtitle: '寛骨の機能異常と立位前屈テスト',
    sections: [
      {
        title: '寛骨の位置：骨盤変位',
        content:
          '<ul>' +
          '<li><strong>上方変位（Up slip）</strong>：ASIS・PSISともに頭側へ変位</li>' +
          '<li><strong>下方変位（Down slip）</strong>：上方変位の反対</li>' +
          '<li><strong>後方回旋</strong>：ASISは頭側、PSISは尾側へ変位</li>' +
          '</ul>',
      },
      {
        title: '腸骨の前方回旋運動',
        content:
          '<ul>' +
          '<li>腸骨が<strong>外上方</strong>へ移動する運動</li>' +
          '<li><strong>腸腰靱帯</strong>が緊張する</li>' +
          '<li>前方回旋では<strong>インフレア</strong>を伴う</li>' +
          '</ul>',
      },
      {
        title: '腸骨の後方回旋運動',
        content:
          '<ul>' +
          '<li>腸骨が<strong>内下方</strong>へ移動する運動</li>' +
          '<li><strong>仙結節靱帯</strong>・<strong>仙棘靱帯</strong>が緊張する</li>' +
          '<li>後方回旋では<strong>アウトフレア</strong>を伴う</li>' +
          '</ul>',
      },
      {
        title: '仙腸関節の運動の対応',
        content:
          '<ul>' +
          '<li>仙骨ニューテーション → 腸骨後方回旋 → アウトフレア</li>' +
          '<li>仙骨カウンターニューテーション → 腸骨前方回旋 → インフレア</li>' +
          '</ul>',
      },
      {
        title: '寛骨の機能異常まとめ表',
        content:
          '<table>' +
          '<tr><th>診断</th><th>StFBT</th><th>ASIS</th><th>腸骨稜</th><th>下肢長</th><th>PSIS</th></tr>' +
          '<tr><td>上方変位 左</td><td>左</td><td>左−頭</td><td>左−頭</td><td>左短</td><td>左−頭</td></tr>' +
          '<tr><td>上方変位 右</td><td>右</td><td>右−頭</td><td>右−頭</td><td>右短</td><td>右−頭</td></tr>' +
          '<tr><td>下方変位 左</td><td>左</td><td>左−尾</td><td>左−尾</td><td>左長</td><td>左−尾</td></tr>' +
          '<tr><td>下方変位 右</td><td>右</td><td>右−尾</td><td>右−尾</td><td>右長</td><td>右−尾</td></tr>' +
          '<tr><td>前方回旋 左</td><td>左</td><td>左長</td><td>左−前頭</td><td></td><td>左−狭</td></tr>' +
          '<tr><td>後方回旋 左</td><td>左</td><td>左短</td><td>左−後尾</td><td></td><td>左−広</td></tr>' +
          '</table>',
      },
      {
        title: 'StFBT（立位前屈検査）',
        content:
          '<p><strong>手順</strong></p>' +
          '<ul>' +
          '<li>皮膚をずらしてPSISを触知</li>' +
          '<li>患者は頭部から順番に屈曲させていく</li>' +
          '<li>PSISの動きが生じる<strong>速さ</strong>を左右で比較する</li>' +
          '<li>最終姿勢において左右差が<strong>5mm以上</strong>ある場合には病的とみなす</li>' +
          '</ul>' +
          '<p><strong>注意点</strong>：体幹前屈<strong>約60°まで</strong>の範囲で実施する</p>' +
          '<p><strong>判定</strong>：PSISがより頭側・腹側へ変位した側が<strong>可動性低下側</strong></p>' +
          '<p>術者の目の高さは骨盤の高さに合わせる。PSISは下から探す。</p>',
        photoSlot: { slotId: 'stfbt', label: 'StFBT（立位前屈検査）' },
      },
      {
        title: 'Mageeによる骨盤回旋時の下肢長の違い',
        content:
          '<p><strong>背臥位の場合</strong></p>' +
          '<ul>' +
          '<li>寛骨後傾 → 下肢<strong>短い</strong></li>' +
          '<li>寛骨前傾 → 下肢<strong>長い</strong></li>' +
          '</ul>' +
          '<p><strong>長坐位の場合</strong></p>' +
          '<ul>' +
          '<li>寛骨後傾 → 下肢<strong>長い</strong></li>' +
          '<li>寛骨前傾 → 下肢<strong>短い</strong></li>' +
          '</ul>' +
          '<p>背臥位と長坐位で<strong>下肢長が逆転</strong>する</p>',
      },
      {
        title: '寛骨のダウンスリップ',
        content:
          '<p><strong>適応</strong>：寛骨<strong>アップスリップ</strong></p>' +
          '<p><strong>開始肢位</strong></p>' +
          '<ul>' +
          '<li>固定は患者の<strong>自重</strong>による</li>' +
          '<li>同時に後方回旋を与えたい時 → 股関節内転・内旋の<strong>背臥位</strong></li>' +
          '<li>同時に前方回旋を与えたい時 → 股関節内転・内旋の<strong>腹臥位</strong></li>' +
          '</ul>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>足関節のやや上を把持</li>' +
          '<li>歩行肢位の体重移動を前足から後ろ足に移し、グレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'pelvis-downslip', label: '寛骨のダウンスリップ' },
      },
      {
        title: '腸骨後方へのモビライゼーション',
        content:
          '<p><strong>適応</strong>：腸骨<strong>前方変位</strong></p>' +
          '<p><strong>開始肢位</strong></p>' +
          '<ul>' +
          '<li>左股関節外内転中間位＋屈曲</li>' +
          '<li>右股関節はごく軽度伸展位</li>' +
          '</ul>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>左手を腸骨に、右手を坐骨結節部に置く</li>' +
          '<li>腸骨を<strong>尾側・背側・下方</strong>へ動かす</li>' +
          '<li>グレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'ilium-posterior-mob', label: '腸骨後方へのモビライゼーション' },
      },
      {
        title: 'Muscle Energyを用いた腸骨後方へのモビ',
        content:
          '<p><strong>適応</strong>：腸骨<strong>前方変位</strong></p>' +
          '<p><strong>開始肢位</strong></p>' +
          '<ul>' +
          '<li>左股関節外内転中間位＋屈曲</li>' +
          '<li>右股関節はごく軽度伸展位</li>' +
          '</ul>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>患者に<strong>股関節を伸展</strong>させ、それに抵抗を加える</li>' +
          '<li>グレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'ilium-posterior-me', label: 'Muscle Energy 腸骨後方モビ' },
      },
    ],
  },

  // =============================================
  // U08: 骨盤の治療法2
  // =============================================
  {
    unitId: 'U08',
    title: '第8回：骨盤の治療法2',
    subtitle: '腸骨前方モビとフレアのモビライゼーション',
    sections: [
      {
        title: '腸骨前方へのモビライゼーション（腹臥位）',
        content:
          '<p><strong>適応</strong>：腸骨<strong>後方変位</strong></p>' +
          '<p><strong>開始肢位</strong></p>' +
          '<ul>' +
          '<li>患者は腹臥位、左足部は床に着ける</li>' +
          '<li>仙骨のカウンターニューテーションが生じるまで、十分に左股関節を屈曲させる</li>' +
          '</ul>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>膝を軽く屈曲させ、左手小指球部にて腸骨稜を<strong>前方回旋（腹側・外側・頭側）</strong>方向に押し回す</li>' +
          '<li>グレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'ilium-anterior-mob-prone', label: '腸骨前方モビ（腹臥位）' },
      },
      {
        title: '腸骨前方へのモビライゼーション（背臥位）',
        content:
          '<p><strong>適応</strong>：腸骨<strong>後方変位</strong></p>' +
          '<p><strong>開始肢位</strong></p>' +
          '<ul>' +
          '<li>股関節の内転を防ぐために枕を入れる</li>' +
          '<li>右股関節は仙骨のカウンターニューテーションと腰椎後弯が起こるよう十分屈曲させる</li>' +
          '<li>左股関節は左SIJの運動を触知できるまで十分に伸展させる</li>' +
          '</ul>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>右手は坐骨結節、左手は腸骨に置き、左腸骨を<strong>前方</strong>に動かす</li>' +
          '<li>グレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'ilium-anterior-mob-supine', label: '腸骨前方モビ（背臥位）' },
      },
      {
        title: '大腿直筋の収縮を用いた腸骨前方モビ（側臥位）',
        content:
          '<p><strong>適応</strong>：腸骨<strong>後方変位</strong>（妊婦に適応大）</p>' +
          '<p><strong>開始肢位</strong></p>' +
          '<ul>' +
          '<li>患者は左股関節屈曲での側臥位</li>' +
          '<li>右膝関節はPSISの動きが触知できる程度まで屈曲</li>' +
          '</ul>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>術者は膝伸展に軽い抵抗を加え、腸骨を<strong>前方</strong>へ動かす</li>' +
          '<li>グレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'ilium-anterior-mob-sidelying', label: '大腿直筋を用いた腸骨前方モビ（側臥位）' },
      },
      {
        title: '大腿直筋の収縮を用いた腸骨前方モビ（腹臥位）',
        content:
          '<p><strong>適応</strong>：腸骨<strong>後方変位</strong></p>' +
          '<p><strong>開始肢位</strong>：膝屈曲位にて開始</p>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>患者に<strong>膝伸展</strong>を指示する</li>' +
          '<li>術者はそれに軽く抵抗（<strong>40%ぐらい</strong>の抵抗力）をかける</li>' +
          '<li>腸骨に置いた手は、前方回旋を感じるための<strong>センサー</strong>として触知する</li>' +
          '</ul>',
        photoSlot: { slotId: 'ilium-anterior-mob-prone-rf', label: '大腿直筋を用いた腸骨前方モビ（腹臥位）' },
      },
      {
        title: '腸骨前方へのモビライゼーション（腹臥位・ILA固定）',
        content:
          '<p><strong>適応</strong>：腸骨<strong>後方変位</strong></p>' +
          '<p><strong>開始肢位</strong>：術者は患者のやや尾側の障害側と反対に立つ</p>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>右手小指球で左ILAを、手指で左PSISを固定する</li>' +
          '<li>左手で<strong>頭側・腹側・外側</strong>方向へ押し回す</li>' +
          '<li>クロスグリップでない方がやりやすい</li>' +
          '<li>PSISのみの固定では腰椎前弯が増強するため、<strong>ILAからしっかり固定</strong>すること</li>' +
          '<li>グレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'ilium-anterior-mob-ila-fix', label: '腸骨前方モビ（ILA固定法）' },
      },
      {
        title: '腸骨アウトフレアへのモビライゼーション',
        content:
          '<p><strong>適応</strong>：<strong>インフレア</strong></p>' +
          '<p><strong>開始肢位</strong>：股中間位の背臥位</p>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>腹側の手をASISの<strong>内側</strong>から把持</li>' +
          '<li>背側の手でざっくりとPSISを触知</li>' +
          '<li>ASISを<strong>外側</strong>へ、PSISを<strong>内側</strong>へグレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'ilium-outflare-mob', label: '腸骨アウトフレアモビ' },
      },
      {
        title: '腸骨インフレアへのモビライゼーション',
        content:
          '<p><strong>適応</strong>：<strong>アウトフレア</strong></p>' +
          '<p><strong>開始肢位</strong>：股中間位の背臥位</p>' +
          '<p><strong>手技</strong></p>' +
          '<ul>' +
          '<li>腹側の手でASISを<strong>外側</strong>から把持</li>' +
          '<li>背側の手でざっくりとPSISを触知</li>' +
          '<li>ASISを<strong>内側</strong>へ、PSISを<strong>外側</strong>へグレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'ilium-inflare-mob', label: '腸骨インフレアモビ' },
      },
    ],
  },

  // =============================================
  // U09: 腰椎の検査法と治療法
  // =============================================
  {
    unitId: 'U09',
    title: '第9回：腰椎の検査法と治療法',
    subtitle: '脊椎運動の原則・フィーダー/Springing test・コンバーゲンス/ディバーゲンス・分節モビライゼーション',
    sections: [
      {
        title: '脊椎運動の原則 I',
        content:
          '<p><strong>条件：</strong>中間位のとき、連続する脊椎単位の椎骨群で起こる</p>' +
          '<p><strong>原則：</strong>胸椎・腰椎が中間位にあるとき、側屈と回旋は<strong>反対方向</strong>に起こり、凸方向への回旋を伴う</p>',
      },
      {
        title: '脊椎運動の原則 II',
        content:
          '<p><strong>条件：</strong>非中間位（過屈曲・過伸展）のとき、単一の脊椎単位で起こる</p>' +
          '<p><strong>原則：</strong>胸椎・腰椎が非中間位にあるとき、側屈と回旋は<strong>同一方向</strong>に起こる</p>',
      },
      {
        title: '脊椎運動の原則 III',
        content:
          '<p><strong>原則：</strong>いずれかの運動面で運動を始めると、他の運動面でのその分節の運動が変化する</p>' +
          '<table><tr><th>原則</th><th>位置</th><th>単位</th><th>側屈と回旋</th></tr>' +
          '<tr><td>I</td><td>中間位</td><td>椎骨群</td><td>反対方向</td></tr>' +
          '<tr><td>II</td><td>非中間位</td><td>単一</td><td>同一方向</td></tr>' +
          '<tr><td>III</td><td>—</td><td>—</td><td>他の面の運動が変化</td></tr></table>',
      },
      {
        title: '触診による脊椎レベルの同定',
        content:
          '<ul>' +
          '<li>触診による腸骨稜間線（ICL）は多くの場合 <strong>L4棘突起</strong> または <strong>L3/4棘突起間</strong> を通過する</li>' +
          '<li>PSIS線は <strong>S2</strong> 付近を通過する</li>' +
          '</ul>',
      },
      {
        title: '棘突起と横突起の関係',
        content:
          '<p>棘突起の～横指外側、～横指頭側に横突起がある</p>' +
          '<table><tr><th>脊椎レベル</th><th>外側</th><th>頭側</th></tr>' +
          '<tr><td>C1〜C7</td><td>2横指</td><td>1.5横指</td></tr>' +
          '<tr><td>Th1〜5</td><td>2横指</td><td>2横指</td></tr>' +
          '<tr><td>Th6〜9</td><td>2横指</td><td>3横指</td></tr>' +
          '<tr><td>Th10〜12</td><td>2横指</td><td>2横指</td></tr>' +
          '<tr><td>L1〜5</td><td>2横指</td><td>1.5横指</td></tr></table>',
      },
      {
        title: 'フィーダーテスト',
        content:
          '<p><strong>目的：</strong>疼痛分節・過剰/過少運動性分節の特定</p>' +
          '<p><strong>開始肢位：</strong>腹臥位</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>棘突起をノーズグリップにて把持</li>' +
          '<li>手を重ね、腹側へ押す</li>' +
          '<li>apprehension をみる</li>' +
          '</ol>',
        photoSlot: { slotId: 'lumbar-feeder-test', label: 'フィーダーテスト' },
      },
      {
        title: 'Springing test',
        content:
          '<p><strong>目的：</strong>疼痛分節・過剰/過少運動性分節の特定</p>' +
          '<p><strong>開始肢位：</strong>腹臥位</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>示指と中指をひろげ、肋骨突起を押す</li>' +
          '<li>End feel と Joint play をみる</li>' +
          '</ol>' +
          '<p>※ L5/S1では指尖を<strong>尾側</strong>に向けて検査する（腸骨に挟まれているため）</p>',
        photoSlot: { slotId: 'lumbar-springing', label: 'Springing test' },
      },
      {
        title: 'コンバーゲンスとディバーゲンス',
        content:
          '<p><strong>Convergence（収束）：</strong>椎間関節面の滑り込み → 関節接触面の増大</p>' +
          '<ul><li>伸展 ＋ 同側側屈 ＋ 反対側回旋</li></ul>' +
          '<p><strong>Divergence（開散）：</strong>椎間関節面の離れ滑り → 関節接触面の減少</p>' +
          '<ul><li>屈曲 ＋ 反対側側屈 ＋ 反対側回旋</li></ul>' +
          '<p>※ Divergence は全ての脊椎で同じ方向</p>' +
          '<p>※ Convergence は頸椎〜Th4で同側回旋（胸椎・腰椎では反対側回旋）</p>',
      },
      {
        title: '分節モビライゼーション',
        content:
          '<p><strong>目的：</strong>左椎間関節の Joint Play 改善（屈曲・伸展・側屈・回旋すべてに有効）</p>' +
          '<p><strong>開始肢位：</strong>右側臥位</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>頭側の示指で棘突起間を触診する</li>' +
          '<li>治療分節の下位の分節に運動が伝わるまで股関節を屈曲させる</li>' +
          '<li>患者の左骨盤を腋でホールドし、術者の体幹を右側屈させる</li>' +
          '<li>伸展した母指を上位分節棘突起の左側に置く</li>' +
          '<li>屈曲した示指を尾側棘突起の右側へ置き、棘突起の右方への回旋を固定する</li>' +
          '<li>患者に左側を見るよう指示し頭頸部を左回旋、胸郭を左回旋させ治療分節で伸展・左回旋を触知する</li>' +
          '<li>PIR をかけてもよい</li>' +
          '</ol>' +
          '<p>※ 治療分節は組み合わせ運動（伸展・右側屈・左回旋）、上位・下位は反組み合わせ運動で閉鎖肢位とする</p>',
        photoSlot: { slotId: 'lumbar-segmental-mob', label: '分節モビライゼーション' },
      },
    ],
  },

  // =============================================
  // U10: 肩関節のモビライゼーション
  // =============================================
  {
    unitId: 'U10',
    title: '第10回：肩関節のモビライゼーション',
    subtitle: '肩関節の離開・尾側/背側/腹側モビライゼーション・肩甲胸郭関節・疼痛性肩関節制動症',
    sections: [
      {
        title: '肩関節の離開（坐位）',
        content:
          '<p><strong>目的：</strong>疼痛軽減、hypomobility の改善、肩運動制限に利用</p>' +
          '<p><strong>開始肢位：</strong>坐位</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ul>' +
          '<li>関節面に対して<strong>垂直</strong>に引き離す</li>' +
          '<li><strong>Scapula plane（肩甲骨面）</strong>上で実施</li>' +
          '<li>肩甲棘の向きが重要</li>' +
          '</ul>',
        photoSlot: { slotId: 'shoulder-traction-sitting', label: '肩関節離開（坐位）' },
      },
      {
        title: '肩関節の離開（背臥位）',
        content:
          '<p><strong>目的：</strong>疼痛軽減、hypomobility の改善</p>' +
          '<p><strong>開始肢位：</strong>背臥位、肩の肢位は様々でよい</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>小指球部にて上腕近位端を内側からつかむ</li>' +
          '<li>膝・股関節を伸展させながら、外側やや上方へグレード I〜II の範囲で離開</li>' +
          '<li>治療はグレード III にて4〜5回繰り返す</li>' +
          '</ol>' +
          '<p>※ カウンターは当てない</p>',
        photoSlot: { slotId: 'shoulder-traction-supine', label: '肩関節離開（背臥位）' },
      },
      {
        title: '第2肩関節に対する尾側への離開',
        content:
          '<p><strong>目的：</strong>第2肩関節に対しての疼痛軽減に利用</p>' +
          '<p><strong>開始肢位：</strong>背臥位</p>' +
          '<p><strong>手技：</strong>尾側方向へ離開する</p>',
        photoSlot: { slotId: 'shoulder-2nd-joint-caudal', label: '第2肩関節の尾側離開' },
      },
      {
        title: '肩関節：尾側方向へのモビ（坐位）',
        content:
          '<p><strong>目的：</strong>外転制限時に利用</p>' +
          '<p><strong>開始肢位：</strong>坐位、現在の静止肢位にて実施</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ul>' +
          '<li>小指球にて尾側へ押す</li>' +
          '<li>膝・股関節を屈曲して押す</li>' +
          '<li>カウンターは当てない</li>' +
          '</ul>' +
          '<p>※ 尾側とは上腕骨長軸に対して平行な方向<strong>ではない</strong>（下垂位を除く）</p>' +
          '<p><strong>適応：</strong>挙上制限（屈曲・外転制限）</p>',
        photoSlot: { slotId: 'shoulder-caudal-mob', label: '肩関節 尾側モビ' },
      },
      {
        title: '肩関節の背側・腹側へのモビ（背臥位）',
        content:
          '<p><strong>目的：</strong></p>' +
          '<table><tr><th>方向</th><th>適応</th></tr>' +
          '<tr><td>下方（尾側）</td><td>挙上制限（屈曲・外転）</td></tr>' +
          '<tr><td>背側</td><td>内旋制限</td></tr>' +
          '<tr><td>腹側</td><td>外旋 / 屈曲 / 伸展制限</td></tr></table>' +
          '<p style="margin-top:0.8em;font-size:0.85em;color:#555;">📚 <strong>備考（発展学習）</strong>: Kaltenborn 凸の法則に基づく基本。Johnson AJ et al. <em>JOSPT</em> 2007;37(3):88-99 の RCT では癒着性関節包炎で背側滑りが外旋を 31.2° 改善と報告。病態により制限因子が変わるため、臨床では患者の症状で方向を決める。</p>' +
          '<p><strong>開始肢位：</strong>背臥位</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>母指球で背側へ、四指で腹側へ滑らす</li>' +
          '<li>グレード III を数回繰り返す</li>' +
          '</ol>',
        photoSlot: { slotId: 'shoulder-dorsal-ventral-mob', label: '肩関節 背側/腹側モビ' },
      },
      {
        title: '肩甲胸郭関節の機能',
        content:
          '<p>Scapula plane 上での肩挙上に伴う運動：</p>' +
          '<ul>' +
          '<li><strong>前額面：</strong>0〜30°まで下制あるいは下方回旋、30°以上で上方回旋</li>' +
          '<li><strong>水平面：</strong>90°挙上位まで外転、それ以降は内転</li>' +
          '<li>前方挙上では外転が、側方挙上では内転がさらに必要</li>' +
          '</ul>' +
          '<p>※ 0〜30°、60〜90°では肩甲骨がいったん下制する → <strong>フローティング現象</strong></p>',
      },
      {
        title: '疼痛性肩関節制動症のポイント',
        content:
          '<ul>' +
          '<li>屈曲 ＋ 内旋：<strong>回内</strong>しながら</li>' +
          '<li>伸展 ＋ 外旋：<strong>回外</strong>しながら</li>' +
          '<li>腹側滑りは出さない</li>' +
          '<li>肩甲骨の代償を抑制するべく<strong>下制を強調</strong>する</li>' +
          '</ul>',
      },
    ],
  },

  // =============================================
  // U11: 肘関節のモビライゼーション
  // =============================================
  {
    unitId: 'U11',
    title: '第11回：肘関節のモビライゼーション',
    subtitle: '腕尺関節離開・近位/遠位橈尺関節のモビライゼーション',
    sections: [
      {
        title: '腕尺関節離開のポイント',
        content:
          '<p>滑車切痕の角度が<strong>45°</strong>であることが重要なポイント</p>' +
          '<p>45°以上と以下でテクニックが異なる</p>',
      },
      {
        title: '腕尺関節離開（45°以上）',
        content:
          '<p><strong>目的：</strong>屈曲・伸展制限に利用</p>' +
          '<p><strong>開始肢位：</strong>上腕近位をベッドと上体に挟んだ側臥位。患者の手背は術者の肩に添える</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>示指で内側の腕尺関節裂隙を触知する</li>' +
          '<li>もう一方の手で前腕近位の尺側から把持し、小指球で回外するように引き寄せる</li>' +
          '<li>裂隙が広がったことを確認しながらグレード I〜II で離開を繰り返す</li>' +
          '</ol>',
        photoSlot: { slotId: 'elbow-ulnohumeral-traction-over45', label: '腕尺関節離開（45°以上）' },
      },
      {
        title: '腕尺関節離開（45°以下）',
        content:
          '<p><strong>目的：</strong>屈曲・伸展制限に利用</p>' +
          '<p><strong>開始肢位：</strong>側臥位、術者は患者の頭側に位置</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>頭側の手の手掌を尺骨近位の掌側面からコンタクトし、もう一方の手で前腕を把持する</li>' +
          '<li>頭側の肘を伸ばして、腰を回旋して離開を加える</li>' +
          '</ol>',
        photoSlot: { slotId: 'elbow-ulnohumeral-traction-under45', label: '腕尺関節離開（45°以下）' },
      },
      {
        title: '近位橈尺関節（遠位方向への離開）',
        content:
          '<p><strong>目的：</strong>過小運動性に利用</p>' +
          '<p><strong>開始肢位：</strong>背臥位、肩関節約90°外転位</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>一方の手で上腕遠位をベッドに押さえつけ、もう一方の手で前腕遠位を把持する</li>' +
          '<li>腰の回旋を使ってグレード II まで離開を行う</li>' +
          '</ol>',
        photoSlot: { slotId: 'elbow-proximal-radioulnar-traction', label: '近位橈尺関節離開' },
      },
      {
        title: '近位橈尺関節の背側・掌側すべり（坐位）',
        content:
          '<p><strong>目的：</strong>回外制限 → 掌側へ ／ 回内制限 → 背側へ</p>' +
          '<p><strong>開始肢位：</strong>坐位、肩45°外転位</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>一方の手で上腕遠位部を把持し、他方の手で橈骨頭をピンチする</li>' +
          '<li>回外制限 → 掌側へグレード III を繰り返す</li>' +
          '<li>回内制限 → 背側へグレード III を繰り返す</li>' +
          '</ol>' +
          '<table><tr><th>運動</th><th>橈骨頭の方向</th></tr>' +
          '<tr><td>回外時</td><td>掌側へ移動</td></tr>' +
          '<tr><td>回内時</td><td>背側へ移動</td></tr></table>',
        photoSlot: { slotId: 'elbow-proximal-radioulnar-glide-sitting', label: '近位橈尺関節 背側/掌側すべり（坐位）' },
      },
      {
        title: '近位橈尺関節の背側・掌側すべり（テーブル上）',
        content:
          '<p><strong>目的：</strong>回外制限 → 掌側すべり ／ 回内制限 → 背側すべり</p>' +
          '<p><strong>開始肢位：</strong>肩関節45°外転位でテーブルに前腕と上腕を置いた肢位</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>一方の手で肘頭をピンチ握りし、もう一方の手で橈骨頭をピンチ握りする</li>' +
          '<li>回外制限 → 掌側すべりでグレード III を繰り返す</li>' +
          '<li>回内制限 → 背側すべりでグレード III を繰り返す</li>' +
          '</ol>',
        photoSlot: { slotId: 'elbow-proximal-radioulnar-glide-table', label: '近位橈尺関節 背側/掌側すべり（テーブル上）' },
      },
      {
        title: '遠位橈尺関節（掌側/背側への滑り）',
        content:
          '<p><strong>目的：</strong>回内制限 → 尺骨頭を背側へ ／ 回外制限 → 尺骨頭を掌側へ</p>' +
          '<p><strong>開始肢位：</strong>ベッドの端から前腕遠位を出した回外位</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>一方の手で橈骨を把持し、もう一方の手で尺骨を把持する</li>' +
          '<li>回内制限 → 尺骨頭を背側へグレード III を繰り返す</li>' +
          '<li>回外制限 → 尺骨頭を掌側へグレード III を繰り返す</li>' +
          '</ol>' +
          '<table><tr><th>運動</th><th>尺骨頭の方向</th></tr>' +
          '<tr><td>回内時</td><td>背側</td></tr>' +
          '<tr><td>回外時</td><td>掌側</td></tr></table>',
        photoSlot: { slotId: 'elbow-distal-radioulnar-glide', label: '遠位橈尺関節 掌側/背側すべり' },
      },
    ],
  },

  // =============================================
  // U12: 手関節と指のモビライゼーション
  // =============================================
  {
    unitId: 'U12',
    title: '第12回：手関節と指のモビライゼーション',
    subtitle: '手関節離開・橈骨手根関節・手根骨間・CM関節・MP/PIP/DIP関節のモビライゼーション',
    sections: [
      {
        title: '掌側傾斜角と尺側傾斜角',
        content:
          '<p><strong>尺骨バリアント</strong>：橈骨遠位端に対する尺骨遠位端の長さ</p>' +
          '<ul>' +
          '<li>長いときは <strong>＋variant</strong></li>' +
          '<li>短いときは <strong>－variant</strong></li>' +
          '<li>mm で表示する</li>' +
          '</ul>',
      },
      {
        title: '手関節の離開',
        content:
          '<p><strong>目的：</strong>疼痛軽減・背屈・掌屈制限の改善</p>' +
          '<p><strong>開始肢位：</strong>前腕の下に布を置き、手関節部をベッドの端に合わせる。前腕を橈側に約20°寄せる</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>頭側の手で前腕遠位を把持する</li>' +
          '<li>もう一方の手は患者の母指と示指の間（ウェッブ）に小指をかけ、手部を握り込む</li>' +
          '<li>肩の力を使ってベッドと平行に離開する</li>' +
          '</ol>',
        photoSlot: { slotId: 'wrist-traction', label: '手関節離開' },
      },
      {
        title: '橈骨手根関節の掌側すべり',
        content:
          '<p><strong>目的：</strong>背屈制限に利用</p>' +
          '<p><strong>開始肢位：</strong>前腕回内位、橈側に約20°寄せる</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>前腕遠位を把持し、ウェッブに小指をかけて手部を握る</li>' +
          '<li>掌側（床方向）へグレード III を繰り返す</li>' +
          '</ol>',
        photoSlot: { slotId: 'wrist-radiocarpal-volar-glide', label: '橈骨手根関節 掌側すべり' },
      },
      {
        title: '橈骨手根関節の背側すべり',
        content:
          '<p><strong>目的：</strong>掌屈制限に利用</p>' +
          '<p><strong>開始肢位：</strong>ウェッジの上に前腕を置き、前腕回外位、橈側に約20°寄せる</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>前腕遠位を把持し、ウェッブに小指をかけて手部を握る</li>' +
          '<li>背側（床方向）へグレード III を繰り返す</li>' +
          '</ol>',
        photoSlot: { slotId: 'wrist-radiocarpal-dorsal-glide', label: '橈骨手根関節 背側すべり' },
      },
      {
        title: '橈骨手根関節の尺側すべり',
        content:
          '<p><strong>目的：</strong>橈屈制限に利用</p>' +
          '<p><strong>開始肢位：</strong>前腕中間位（ニュートラル）</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>前腕遠位を把持し、ウェッブに小指をかけて手部を握る</li>' +
          '<li>尺側（床方向）へグレード III を繰り返す</li>' +
          '</ol>',
        photoSlot: { slotId: 'wrist-radiocarpal-ulnar-glide', label: '橈骨手根関節 尺側すべり' },
      },
      {
        title: '橈骨手根関節の橈側すべり',
        content:
          '<p><strong>目的：</strong>尺屈制限に利用</p>' +
          '<p><strong>開始肢位：</strong>前腕中間位（ニュートラル）</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ul>' +
          '<li>橈側（天井方向）へ掻き上げるようにグレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'wrist-radiocarpal-radial-glide', label: '橈骨手根関節 橈側すべり' },
      },
      {
        title: '手根骨の動き',
        content:
          '<table>' +
          '<tr><th>手根骨</th><th>背屈時</th><th>掌屈時</th><th>凸凹</th></tr>' +
          '<tr><td>舟状骨</td><td>掌</td><td>背</td><td>凸</td></tr>' +
          '<tr><td>大菱形骨</td><td>背</td><td>掌</td><td>凹</td></tr>' +
          '<tr><td>月状骨</td><td>掌</td><td>背</td><td>凸</td></tr>' +
          '<tr><td>有頭骨</td><td>掌</td><td>背</td><td>凸</td></tr>' +
          '<tr><td>三角骨</td><td>掌</td><td>背</td><td>凸</td></tr>' +
          '<tr><td>有鈎骨</td><td>掌</td><td>背</td><td>凸</td></tr>' +
          '<tr><td>小菱形骨</td><td>背</td><td>掌</td><td>凹</td></tr>' +
          '</table>',
      },
      {
        title: '橈骨-舟状骨の掌側・背側への滑り',
        content:
          '<p><strong>目的：</strong>背屈制限 → 掌側へ ／ 掌屈制限 → 背側へ</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>頭側の手で橈骨をしっかり把持する</li>' +
          '<li>舟状骨（スナフボックスや舟状骨結節から）を的確にピンチする</li>' +
          '<li>背屈制限 → 掌側へ、掌屈制限 → 背側へグレード III を繰り返す</li>' +
          '</ol>',
        photoSlot: { slotId: 'wrist-radius-scaphoid-glide', label: '橈骨-舟状骨 滑り' },
      },
      {
        title: '有頭-月状骨のモビライゼーション',
        content:
          '<p><strong>目的：</strong>背屈制限 → 掌側すべり（回内位） ／ 掌屈制限 → 背側すべり（回外位）</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ul>' +
          '<li>ウェッジの端に月状骨を乗せ、母指で有頭骨をコンタクトし、重ねた手の尺側を当ててグレード III を繰り返す</li>' +
          '</ul>',
        photoSlot: { slotId: 'wrist-capitate-lunate-mob', label: '有頭-月状骨モビ' },
      },
      {
        title: '橈骨-月状骨のモビライゼーション',
        content:
          '<p><strong>目的：</strong>背屈制限 → 掌側すべり ／ 掌屈制限 → 背側すべり</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>橈骨をしっかり把持する</li>' +
          '<li>月状骨（第3中手骨の直軸上）を的確にピンチする</li>' +
          '<li>背屈制限 → 掌側へ、掌屈制限 → 背側へグレード III を繰り返す</li>' +
          '</ol>',
        photoSlot: { slotId: 'wrist-radius-lunate-mob', label: '橈骨-月状骨モビ' },
      },
      {
        title: '尺骨-三角骨の掌側・背側すべり',
        content:
          '<p><strong>目的：</strong>背屈制限 → 掌側すべり ／ 掌屈制限 → 背側すべり</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>尺骨をしっかり把持する</li>' +
          '<li>三角骨（豆状骨を介して）をしっかりピンチする</li>' +
          '<li>凸の関節：背屈制限 → 掌側へ、掌屈制限 → 背側へグレード III を繰り返す</li>' +
          '</ol>',
        photoSlot: { slotId: 'wrist-ulna-triquetrum-glide', label: '尺骨-三角骨 滑り' },
      },
      {
        title: '舟状骨-大菱形骨の掌側・背側の滑り',
        content:
          '<p><strong>目的：</strong>背屈制限 → <strong>背側</strong>すべり ／ 掌屈制限 → <strong>掌側</strong>すべり（凹の関節）</p>' +
          '<p><strong>手技：</strong></p>' +
          '<ol>' +
          '<li>舟状骨を的確にピンチする</li>' +
          '<li>大菱形骨もしっかりピンチする</li>' +
          '<li>凹の関節：背屈制限 → 背側へ、掌屈制限 → 掌側へグレード III を繰り返す</li>' +
          '</ol>',
        photoSlot: { slotId: 'wrist-scaphoid-trapezium-glide', label: '舟状骨-大菱形骨 滑り' },
      },
      {
        title: '第2〜第5CM関節の離開と滑り',
        content:
          '<p><strong>CM関節の可動性：</strong></p>' +
          '<ul>' +
          '<li>第2・3CM関節 → 可動性はない</li>' +
          '<li>第4CM関節 → 約15°の屈伸</li>' +
          '<li>第5CM関節 → 約25〜30°の屈伸</li>' +
          '</ul>' +
          '<p><strong>手技（離開）：</strong>中手骨をピンチし、対応する手根骨の近位をピンチして離開</p>' +
          '<p><strong>手技（滑り：第3〜5CM関節）：</strong>凸の関節 → 屈曲制限は掌側へ、伸展制限は背側へグレード III を繰り返す</p>',
        photoSlot: { slotId: 'hand-cm-joint-mob', label: 'CM関節モビ' },
      },
      {
        title: '第1CM関節（鞍関節）',
        content:
          '<table><tr><th>運動</th><th>凸凹</th><th>滑りの方向</th></tr>' +
          '<tr><td>掌側外転</td><td>凸</td><td>尺側へ</td></tr>' +
          '<tr><td>橈側外転</td><td>凹</td><td>背側へ</td></tr></table>' +
          '<p><strong>掌側外転制限：</strong>凸 → 尺側（第2中手骨側）へ滑らす</p>' +
          '<p><strong>掌側内転制限：</strong>凸 → 橈側方向へ並進</p>' +
          '<p><strong>橈側外転制限：</strong>凹 → 背側方向へ滑らす</p>' +
          '<p><strong>尺側内転制限：</strong>凹 → 掌側方向へ滑らす</p>' +
          '<p><strong>手技：</strong>大菱形骨をピンチし、中手骨近位をしっかりピンチしてグレード III でモビライゼーションする</p>',
        photoSlot: { slotId: 'hand-1st-cm-joint-mob', label: '第1CM関節モビ' },
      },
      {
        title: 'MP・PIP・DIP関節の離開',
        content:
          '<p><strong>把持する骨：</strong></p>' +
          '<ul>' +
          '<li>MP関節 → 中手骨と基節骨</li>' +
          '<li>PIP関節 → 基節骨と中節骨</li>' +
          '<li>DIP関節 → 中節骨と末節骨</li>' +
          '</ul>' +
          '<p><strong>手技：</strong>ピンチやノーズグリップでしっかりコンタクトし、治療面と直角に離開する</p>',
        photoSlot: { slotId: 'hand-finger-traction', label: 'MP/PIP/DIP関節離開' },
      },
      {
        title: 'MP・PIP・DIP関節の掌側・背側への滑り',
        content:
          '<ul>' +
          '<li><strong>屈曲制限</strong> → 掌側方向へ滑らす</li>' +
          '<li><strong>伸展制限</strong> → 背側方向へ滑らす</li>' +
          '</ul>' +
          '<p>各関節をしっかりピンチしてグレード III を繰り返す</p>',
        photoSlot: { slotId: 'hand-finger-glide', label: 'MP/PIP/DIP関節 掌側/背側滑り' },
      },
    ],
  },
] as const
