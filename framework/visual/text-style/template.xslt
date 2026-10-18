<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    <xsl:template match="/">
        <xsl:choose>
            <xsl:when test="/*/@kind='important'">
                <strong class="ck-text-style ck-text-style--important"><ck-children/></strong>
            </xsl:when>
            <xsl:when test="/*/@kind='emphase'">
                <em class="ck-text-style ck-text-style--emphase"><ck-children/></em>
            </xsl:when>
            <xsl:otherwise>
                <u class="ck-text-style ck-text-style--underline"><ck-children/></u>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
